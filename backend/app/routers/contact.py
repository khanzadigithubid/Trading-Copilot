"""
Contact form endpoint — sends email via Gmail SMTP (Python built-in smtplib).
No extra packages needed. Uses Gmail App Password for authentication.
Setup: Enable 2FA on Gmail → Generate App Password → Set env vars.
"""
import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field

from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/contact", tags=["contact"])


class ContactRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=10, max_length=5000)


class ContactResponse(BaseModel):
    success: bool
    message: str


@router.post("", response_model=ContactResponse)
async def send_contact_email(payload: ContactRequest):
    """Send contact form email via Gmail SMTP."""

    # If Gmail credentials not set — just log and return success
    if not settings.gmail_user or not settings.gmail_pass:
        logger.info(f"[CONTACT] {payload.name} <{payload.email}>: {payload.subject}")
        logger.warning("[CONTACT] Gmail credentials not set. Email not sent.")
        return ContactResponse(
            success=True,
            message="Message received! We'll get back to you soon."
        )

    try:
        # Build email
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[Contact] {payload.subject} — from {payload.name}"
        msg["From"] = settings.gmail_user
        msg["To"] = settings.contact_email
        msg["Reply-To"] = payload.email

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

        msg.attach(MIMEText(html_body, "html"))

        # Send via Gmail SMTP
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(settings.gmail_user, settings.gmail_pass)
            server.sendmail(
                from_addr=settings.gmail_user,
                to_addrs=[settings.contact_email],
                msg=msg.as_string()
            )

        logger.info(f"[CONTACT] Email sent to {settings.contact_email} from {payload.email}")
        return ContactResponse(
            success=True,
            message="Message sent! We'll reply within 24 hours."
        )

    except smtplib.SMTPAuthenticationError:
        logger.error("[CONTACT] Gmail authentication failed. Check GMAIL_USER and GMAIL_PASS.")
        raise HTTPException(
            status_code=500,
            detail="Email authentication failed. Please contact us directly at memonbisma22@gmail.com"
        )
    except Exception as e:
        logger.error(f"[CONTACT] SMTP error: {type(e).__name__}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send email: {str(e)}"
        )
