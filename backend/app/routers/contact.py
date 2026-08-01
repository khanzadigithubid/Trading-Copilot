"""
Contact form endpoint — sends email via Resend API.
Free tier: 100 emails/day. Get key at https://resend.com
Note: Free plan sends FROM onboarding@resend.dev TO your verified email only.
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
        # No email key — log and return success
        print(f"[CONTACT] {payload.name} <{payload.email}>: {payload.subject}")
        return ContactResponse(
            success=True,
            message="Message received! We'll get back to you soon."
        )

    try:
        import resend
        resend.api_key = settings.resend_api_key

        html_body = f"""
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#10b981;padding:20px;border-radius:8px 8px 0 0;">
    <h2 style="color:#020617;margin:0;">New Contact Form Message</h2>
    <p style="color:#064e3b;margin:4px 0 0;">AI Trading Copilot</p>
  </div>
  <div style="background:#1e293b;padding:24px;border-radius:0 0 8px 8px;color:#f8fafc;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px 0;color:#94a3b8;width:80px;">From:</td><td style="color:#f8fafc;">{payload.name}</td></tr>
      <tr><td style="padding:8px 0;color:#94a3b8;">Email:</td><td><a href="mailto:{payload.email}" style="color:#10b981;">{payload.email}</a></td></tr>
      <tr><td style="padding:8px 0;color:#94a3b8;">Subject:</td><td style="color:#f8fafc;">{payload.subject}</td></tr>
    </table>
    <hr style="border:1px solid #334155;margin:16px 0;"/>
    <p style="color:#94a3b8;margin:0 0 8px;">Message:</p>
    <div style="background:#0f172a;padding:16px;border-radius:6px;color:#e2e8f0;line-height:1.6;">
      {payload.message.replace(chr(10), '<br>')}
    </div>
    <hr style="border:1px solid #334155;margin:16px 0;"/>
    <p style="color:#64748b;font-size:12px;">Reply to: {payload.email}</p>
  </div>
</div>"""

        # Send to admin (free Resend plan: from onboarding@resend.dev to your verified email)
        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": [settings.contact_email],
            "reply_to": payload.email,
            "subject": f"[Contact] {payload.subject} — from {payload.name}",
            "html": html_body,
        })

        return ContactResponse(
            success=True,
            message="Message sent! We'll reply within 24 hours."
        )

    except Exception as e:
        print(f"Email error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to send email. Please try again later."
        )
