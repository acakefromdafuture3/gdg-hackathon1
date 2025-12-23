import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
SENDER_EMAIL = os.getenv("SENDGRID_FROM_EMAIL")


def send_email(to_emails, subject, html_content):
    try:
        if not SENDGRID_API_KEY:
            print("❌ SENDGRID_API_KEY missing")
            return

        if not SENDER_EMAIL:
            print("❌ SENDGRID_FROM_EMAIL missing")
            return

        if not to_emails:
            print("⚠️ No recipients provided")
            return

        print("📧 Sending email via SendGrid")
        print("➡️ To:", to_emails)

        message = Mail(
            from_email=SENDER_EMAIL,
            to_emails=to_emails,
            subject=subject,
            html_content=html_content
        )

        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)

        print("✅ Email sent successfully")
        print("📨 Status:", response.status_code)

    except Exception as e:
        print("❌ SENDGRID EMAIL FAILED:", str(e))
