from datetime import datetime, timedelta, timezone
from typing import Optional
import secrets
import bcrypt
from fastapi import HTTPException, status
from supabase import Client

class AuthService:
    def __init__(self, supabase: Client):
        self.supabase = supabase
    
    def hash_password(self, password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    
    async def authenticate_admin(self, email: str, password: str) -> Optional[dict]:
        """Authenticate admin user"""
        try:
            response = self.supabase.table('admin_users').select('*').eq('email', email).execute()
            
            if not response.data or len(response.data) == 0:
                return None
            
            admin = response.data[0]
            
            if self.verify_password(password, admin['hashed_password']):
                return admin
            
            return None
        except Exception as e:
            print(f"Authentication error: {str(e)}")
            return None
    
    async def create_password_change_token(self, admin_id: int) -> str:
        """Create a password change verification token"""
        token = secrets.token_urlsafe(32)
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)
        
        try:
            self.supabase.table('password_change_tokens').insert({
                'admin_id': admin_id,
                'token': token,
                'expires_at': expires_at.isoformat(),
                'used': False
            }).execute()
            
            return token
        except Exception as e:
            print(f"Error creating token: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create verification token"
            )
    
    async def verify_and_change_password(self, token: str, new_password: str) -> bool:
        """Verify token and change password"""
        try:
            # Get token
            response = self.supabase.table('password_change_tokens').select('*, admin_users(email)').eq('token', token).eq('used', False).execute()
            
            if not response.data or len(response.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid or expired token"
                )
            
            token_data = response.data[0]
            
            # Check expiration
            expires_at = datetime.fromisoformat(token_data['expires_at'].replace('Z', '+00:00'))
            if datetime.now(timezone.utc) > expires_at:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Token has expired"
                )
            
            # Hash new password
            hashed_password = self.hash_password(new_password)
            
            # Update password
            self.supabase.table('admin_users').update({
                'hashed_password': hashed_password,
                'updated_at': datetime.now(timezone.utc).isoformat()
            }).eq('id', token_data['admin_id']).execute()
            
            # Mark token as used
            self.supabase.table('password_change_tokens').update({'used': True}).eq('token', token).execute()
            
            return True
        except HTTPException:
            raise
        except Exception as e:
            print(f"Error changing password: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to change password"
            )
    
    async def get_admin_email(self, admin_id: int) -> Optional[str]:
        """Get admin email by ID"""
        try:
            response = self.supabase.table('admin_users').select('email').eq('id', admin_id).execute()
            if response.data and len(response.data) > 0:
                return response.data[0]['email']
            return None
        except Exception as e:
            print(f"Error getting admin email: {str(e)}")
            return None