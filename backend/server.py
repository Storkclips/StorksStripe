from fastapi import FastAPI, APIRouter, Request, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
from auth import AuthService
from services.email_service import email_service


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase connection
SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_SERVICE_KEY']
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize auth service
auth_service = AuthService(supabase)

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
    return {"message": "Tipping Page API with Supabase"}

@api_router.get("/creator", response_model=CreatorProfile)
async def get_creator_profile():
    try:
        response = supabase.table('creator_profile').select("*").limit(1).execute()
        if response.data and len(response.data) > 0:
            return CreatorProfile(**response.data[0])
        return CreatorProfile()
    except Exception as e:
        logging.error(f"Error fetching creator profile: {str(e)}")
        return CreatorProfile()

@api_router.post("/creator", response_model=CreatorProfile)
async def update_creator_profile(profile_update: CreatorProfileUpdate):
    try:
        # Get existing profile
        response = supabase.table('creator_profile').select("*").limit(1).execute()
        
        if response.data and len(response.data) > 0:
            # Update existing
            existing = response.data[0]
            update_data = profile_update.model_dump(exclude_none=True)
            
            updated = supabase.table('creator_profile').update(update_data).eq('id', existing['id']).execute()
            return CreatorProfile(**updated.data[0])
        else:
            # Create new
            new_profile = CreatorProfile()
            update_data = profile_update.model_dump(exclude_none=True)
            profile_dict = new_profile.model_dump()
            profile_dict.update(update_data)
            
            created = supabase.table('creator_profile').insert(profile_dict).execute()
            return CreatorProfile(**created.data[0])
    except Exception as e:
        logging.error(f"Error updating creator profile: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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
        
        # Create payment transaction record in Supabase
        transaction_data = {
            "id": str(uuid.uuid4()),
            "session_id": session.session_id,
            "amount": request.amount,
            "currency": "usd",
            "message": request.message,
            "tipper_name": request.tipper_name or "Anonymous",
            "status": "initiated",
            "payment_status": "pending",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        supabase.table('payment_transactions').insert(transaction_data).execute()
        
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
        
        # Find transaction in Supabase
        response = supabase.table('payment_transactions').select("*").eq('session_id', session_id).execute()
        
        if response.data and len(response.data) > 0:
            transaction = response.data[0]
            # Only update if payment status changed to paid and not already processed
            if checkout_status.payment_status == "paid" and transaction.get("payment_status") != "paid":
                supabase.table('payment_transactions').update({
                    "status": checkout_status.status,
                    "payment_status": checkout_status.payment_status
                }).eq('session_id', session_id).execute()
        
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
            supabase.table('payment_transactions').update({
                "status": "completed",
                "payment_status": webhook_response.payment_status
            }).eq('session_id', webhook_response.session_id).execute()
        
        return {"status": "success"}
        
    except Exception as e:
        logging.error(f"Error handling webhook: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/tips/recent", response_model=List[TipResponse])
async def get_recent_tips(limit: int = 10):
    try:
        # Get successful tips only
        response = supabase.table('payment_transactions').select(
            "amount, message, tipper_name, timestamp"
        ).eq('payment_status', 'paid').order('timestamp', desc=True).limit(limit).execute()
        
        tips = []
        for tip in response.data:
            tips.append(TipResponse(
                amount=tip['amount'],
                message=tip.get('message'),
                tipper_name=tip.get('tipper_name'),
                timestamp=datetime.fromisoformat(tip['timestamp'].replace('Z', '+00:00'))
            ))
        
        return tips
    except Exception as e:
        logging.error(f"Error fetching recent tips: {str(e)}")
        return []


# Admin Authentication Models
class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str

class AdminPasswordChangeRequest(BaseModel):
    admin_id: int
    current_password: str
    new_password: str

class VerifyPasswordChangeRequest(BaseModel):
    token: str
    new_password: str


# Admin Authentication Routes
@api_router.post("/admin/login")
async def admin_login(login_data: AdminLoginRequest):
    """Admin login endpoint"""
    admin = await auth_service.authenticate_admin(login_data.email, login_data.password)
    
    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    
    return {
        "success": True,
        "admin": {
            "id": admin['id'],
            "email": admin['email']
        }
    }

@api_router.post("/admin/change-password")
async def change_admin_password(password_data: AdminPasswordChangeRequest):
    """Change admin password directly (no email verification)"""
    try:
        # Verify current password
        admin_email = await auth_service.get_admin_email(password_data.admin_id)
        if not admin_email:
            raise HTTPException(status_code=404, detail="Admin not found")
        
        admin = await auth_service.authenticate_admin(admin_email, password_data.current_password)
        if not admin:
            raise HTTPException(status_code=401, detail="Current password is incorrect")
        
        # Validate new password
        if len(password_data.new_password) < 8:
            raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
        
        if password_data.new_password == password_data.current_password:
            raise HTTPException(status_code=400, detail="New password must be different from current password")
        
        # Hash and update password directly
        hashed_password = auth_service.hash_password(password_data.new_password)
        
        from datetime import datetime, timezone
        supabase.table('admin_users').update({
            'hashed_password': hashed_password,
            'updated_at': datetime.now(timezone.utc).isoformat()
        }).eq('id', password_data.admin_id).execute()
        
        return {
            "success": True,
            "message": "Password changed successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error changing password: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to change password")

@api_router.post("/admin/verify-password-change")
async def verify_password_change(verify_data: VerifyPasswordChangeRequest):
    """Verify token and complete password change"""
    try:
        # Get token data to get admin email before changing password
        response = supabase.table('password_change_tokens').select('*, admin_users(email)').eq('token', verify_data.token).eq('used', False).execute()
        
        if response.data and len(response.data) > 0:
            admin_email = response.data[0]['admin_users']['email']
        else:
            admin_email = None
        
        # Verify and change password
        success = await auth_service.verify_and_change_password(verify_data.token, verify_data.new_password)
        
        if success and admin_email:
            # Send confirmation email
            try:
                email_service.send_password_changed_confirmation(admin_email)
            except Exception as e:
                logging.error(f"Failed to send confirmation email: {str(e)}")
        
        return {
            "success": True,
            "message": "Password changed successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error verifying password change: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to change password")

@api_router.get("/admin/profile/{admin_id}")
async def get_admin_profile(admin_id: int):
    """Get admin profile"""
    try:
        response = supabase.table('admin_users').select('id, email, created_at').eq('id', admin_id).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Admin not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching admin profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch profile")


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
