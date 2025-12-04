import resend
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

resend.api_key = os.environ.get('RESEND_API_KEY')

class EmailService:
    @staticmethod
    def send_password_change_verification(email: str, token: str, frontend_url: str):
        """Send password change verification email"""
        verification_link = f"{frontend_url}/admin/verify-password-change?token={token}"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h2 style="color: #667eea; margin-bottom: 20px;">Password Change Request</h2>
                    <p style="color: #666; line-height: 1.6;">You have requested to change your admin password.</p>
                    <p style="color: #666; line-height: 1.6;">Please click the button below to verify and complete the password change:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{verification_link}" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Verify Password Change</a>
                    </div>
                    <p style="color: #999; font-size: 14px; line-height: 1.6;">This link expires in 15 minutes. If you didn't request this change, please ignore this email.</p>
                    <p style="color: #999; font-size: 14px; margin-top: 20px;">Or copy and paste this link:</p>
                    <p style="color: #667eea; font-size: 12px; word-break: break-all;">{verification_link}</p>
                </div>
            </body>
        </html>
        """
        
        try:
            response = resend.Emails.send({
                "from": "noreply@tippingpage.com",
                "to": email,
                "subject": "Verify Your Password Change",
                "html": html_content,
            })
            return response
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            raise
    
    @staticmethod
    def send_password_changed_confirmation(email: str):
        """Send confirmation email after password change"""
        html_content = """
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h2 style="color: #10b981; margin-bottom: 20px;">✓ Password Changed Successfully</h2>
                    <p style="color: #666; line-height: 1.6;">Your admin password has been changed successfully.</p>
                    <p style="color: #666; line-height: 1.6;">If you did not make this change, please contact support immediately.</p>
                    <p style="color: #999; font-size: 14px; margin-top: 30px;">This is an automated message. Please do not reply.</p>
                </div>
            </body>
        </html>
        """
        
        try:
            response = resend.Emails.send({
                "from": "noreply@tippingpage.com",
                "to": email,
                "subject": "Password Changed Successfully",
                "html": html_content,
            })
            return response
        except Exception as e:
            print(f"Error sending confirmation email: {str(e)}")
            # Don't fail if confirmation email fails
            pass

email_service = EmailService()