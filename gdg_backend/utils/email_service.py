
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os


SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")

print("📧 ABOUT TO SEND EMAIL")

def send_email(to_emails, subject, html_content):
    print("📧 send_email() CALLED")
    print("➡️ To emails:", to_emails)

    if not to_emails:
        print("⚠️ No recipient emails. Skipping send.")
        return

    msg = MIMEMultipart()
    msg["From"] = f"Campus Issue Portal <{SENDER_EMAIL}>"
    msg["To"] = ", ".join(to_emails)
    msg["Subject"] = subject

    msg.attach(MIMEText(html_content, "html"))

    print("🔌 Connecting to SMTP:", SMTP_SERVER, SMTP_PORT)

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        print("✅ SMTP login successful")

        server.send_message(msg)
        print("📤 Email sent successfully")
