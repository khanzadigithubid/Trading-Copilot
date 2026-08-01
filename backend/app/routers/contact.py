"""
Contact form endpoint — sends email via Resend API.
Free tier: 100 emails/day. Get key at https://resend.com
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field

from app.core.config import settings

router = APIRouter(prefix="/contact", tags=["contact"])


class ContactRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=10, max_length=2000)


class ContactResponse(BaseModel):
    success: bool
    message: str


@router.post("", response_model=ContactResponse)
async def send_contact_email(payload: ContactRequest):
    """Send contact form email via Resend."""

    if not settings.resend_api_key:
        # No email service configured — still return success (log only)
        print(f"Contact form (no email key): {payload.name} <{payload.email}> — {payload.subject}")
        return ContactResponse(
            success=True,
            message="Message received! We'll get back to you soon."
        )

    try:
        import resend
        resend.api_key = settings.resend_api_key

        html_body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #10b981; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="color: #020617; margin: 0;">New Contact Form Message</h2>
            <p style="color: #064e3b; margin: 4px 0 0;">AI Trading Copilot</p>
          </div>
          <div style="background: #1e293b; padding: 24px; border-radius: 0 0 8px 8px; color: #f8fafc;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #94a3b8; width: 100px;">From:</td>
                <td style="padding: 8px 0; color: #f8fafc;">{payload.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #94a3b8;">Email:</td>
                <td style="padding: 8px 0;">
                  <a href="mailto:{payload.email}" style="color: #10b981;">{payload.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #94a3b8;">Subject:</td>
                <td style="padding: 8px 0; color: #f8fafc;">{payload.subject}</td>
              </tr>
            </table>
            <hr style="border: 1px solid #334155; margin: 16px 0;" />
            <p style="color: #94a3b8; margin: 0 0 8px;">Message:</p>
            <div style="background: #0f172a; padding: 16px; border-radius: 6px; color: #e2e8f0; line-height: 1.6;">
              {payload.message.replace(chr(10), '<br>')}
            </div>
          </div>
        </div>
        """

        resend.Emails.send({
            "from": "AI Trading Copilot <onboarding@resend.dev>",
            "to": [settings.contact_email],
            "reply_to": payload.email,
            "subject": f"[Contact] {payload.subject} — from {payload.name}",
            "html": html_body,
        })

        # Also send confirmation to the user
        confirm_html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #10b981; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="color: #020617; margin: 0;">Message received! ✅</h2>
          </div>
          <div style="background: #1e293b; padding: 24px; border-radius: 0 0 8px 8px; color: #f8fafc;">
            <p>Hi {payload.name},</p>
            <p>Thank you for reaching out to AI Trading Copilot. We&apos;ve received your message and will get back to you within 24 hours.</p>
            <p style="color: #94a3b8; font-size: 14px;">Your message: <em>&ldquo;{payload.message[:100]}...&rdquo;</em></p>
            <hr style="border: 1px solid #334155; margin: 16px 0;" />
            <p>In the meantime, try our platform:</p>
            <a href="https://kw-trading-copilot.vercel.app" 
               style="display: inline-block; background: #10b981; color: #020617; padding: 10px 24px; border-radius: 999px; text-decoration: none; font-weight: bold;">
              Open Dashboard
            </a>
          </div>
        </div>
        """

        resend.Emails.send({
            "from": "AI Trading Copilot <onboarding@resend.dev>",
            "to": [payload.email],
            "subject": "We received your message — AI Trading Copilot",
            "html": confirm_html,
        })

        return ContactResponse(
            success=True,
            message="Message sent! We'll reply within 24 hours."
        )

    except Exception as e:
        print(f"Email send error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to send email. Please try again later."
        )
