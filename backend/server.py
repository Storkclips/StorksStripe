from fastapi import FastAPI, APIRouter, Request, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class CreatorProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    name: str = "Your Creator Name"
    bio: str = "Support me with a tip!"
    avatar_url: str = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"
    social_links: Dict[str, str] = {}

class CreatorProfileUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    social_links: Optional[Dict[str, str]] = None

class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    amount: float
    currency: str
    message: Optional[str] = None
    tipper_name: Optional[str] = None
    status: str = "pending"
    payment_status: str = "pending"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CheckoutRequest(BaseModel):
    amount: float
    message: Optional[str] = None
    tipper_name: Optional[str] = None
    origin_url: str

class TipResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    amount: float
    message: Optional[str] = None
    tipper_name: Optional[str] = None
    timestamp: datetime


# Routes
@api_router.get("/")
async def root():
    return {"message": "Tipping Page API"}

@api_router.get("/creator", response_model=CreatorProfile)
async def get_creator_profile():
    profile = await db.creator_profile.find_one({}, {"_id": 0})
    if not profile:
        # Return default profile
        return CreatorProfile()
    return CreatorProfile(**profile)

@api_router.post("/creator", response_model=CreatorProfile)
async def update_creator_profile(profile_update: CreatorProfileUpdate):
    # Get existing profile or create new one
    existing = await db.creator_profile.find_one({}, {"_id": 0})
    
    if existing:
        profile_data = existing
    else:
        profile_data = CreatorProfile().model_dump()
    
    # Update with new values
    update_data = profile_update.model_dump(exclude_none=True)
    profile_data.update(update_data)
    
    # Save to database
    await db.creator_profile.delete_many({})
    await db.creator_profile.insert_one(profile_data)
    
    return CreatorProfile(**profile_data)

@api_router.post("/checkout/session")
async def create_checkout_session(request: CheckoutRequest):
    # Validate amount first (before try block)
    if request.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than 0")
    
    try:
        # Get Stripe API key
        api_key = os.environ.get('STRIPE_API_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail="Stripe API key not configured")
        
        # Build webhook and redirect URLs
        webhook_url = f"{request.origin_url}/api/webhook/stripe"
        success_url = f"{request.origin_url}/success?session_id={{{{CHECKOUT_SESSION_ID}}}}"
        cancel_url = f"{request.origin_url}"
        
        # Initialize Stripe checkout
        stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
        
        # Prepare metadata
        metadata = {
            "source": "tipping_page",
            "tipper_name": request.tipper_name or "Anonymous",
            "message": request.message or ""
        }
        
        # Create checkout session
        checkout_request = CheckoutSessionRequest(
            amount=request.amount,
            currency="usd",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata
        )
        
        session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Create payment transaction record
        transaction = PaymentTransaction(
            session_id=session.session_id,
            amount=request.amount,
            currency="usd",
            message=request.message,
            tipper_name=request.tipper_name or "Anonymous",
            status="initiated",
            payment_status="pending"
        )
        
        # Convert to dict and serialize datetime
        doc = transaction.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        
        await db.payment_transactions.insert_one(doc)
        
        return {"url": session.url, "session_id": session.session_id}
        
    except Exception as e:
        logging.error(f"Error creating checkout session: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/checkout/status/{session_id}")
async def get_checkout_status(session_id: str):
    try:
        # Get Stripe API key
        api_key = os.environ.get('STRIPE_API_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail="Stripe API key not configured")
        
        # Initialize Stripe checkout
        webhook_url = ""  # Not needed for status check
        stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
        
        # Get checkout status from Stripe
        checkout_status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        
        # Find transaction in database
        transaction = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
        
        if transaction:
            # Only update if payment status changed to paid and not already processed
            if checkout_status.payment_status == "paid" and transaction.get("payment_status") != "paid":
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {"$set": {
                        "status": checkout_status.status,
                        "payment_status": checkout_status.payment_status
                    }}
                )
        
        return {
            "session_id": session_id,
            "status": checkout_status.status,
            "payment_status": checkout_status.payment_status,
            "amount": checkout_status.amount_total / 100,  # Convert from cents
            "currency": checkout_status.currency
        }
        
    except Exception as e:
        logging.error(f"Error checking payment status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    try:
        # Get Stripe API key
        api_key = os.environ.get('STRIPE_API_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail="Stripe API key not configured")
        
        # Get raw body and signature
        body = await request.body()
        signature = request.headers.get("Stripe-Signature")
        
        if not signature:
            raise HTTPException(status_code=400, detail="Missing Stripe signature")
        
        # Initialize Stripe checkout
        webhook_url = ""  # Already set during initialization
        stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
        
        # Handle webhook
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        # Update transaction based on webhook event
        if webhook_response.event_type == "checkout.session.completed":
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {"$set": {
                    "status": "completed",
                    "payment_status": webhook_response.payment_status
                }}
            )
        
        return {"status": "success"}
        
    except Exception as e:
        logging.error(f"Error handling webhook: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/tips/recent", response_model=List[TipResponse])
async def get_recent_tips(limit: int = 10):
    # Get successful tips only
    tips = await db.payment_transactions.find(
        {"payment_status": "paid"},
        {"_id": 0, "amount": 1, "message": 1, "tipper_name": 1, "timestamp": 1}
    ).sort("timestamp", -1).limit(limit).to_list(limit)
    
    # Convert ISO string timestamps back to datetime objects
    for tip in tips:
        if isinstance(tip['timestamp'], str):
            tip['timestamp'] = datetime.fromisoformat(tip['timestamp'])
    
    return tips


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()