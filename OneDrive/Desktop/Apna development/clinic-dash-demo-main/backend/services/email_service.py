import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    @staticmethod
    def send_email(to_email: str, subject: str, body: str):
        # Configuration for SMTP (e.g., Gmail, SendGrid)
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_user = os.getenv("SMTP_USER", "your-email@example.com")
        smtp_password = os.getenv("SMTP_PASSWORD", "your-password")

        message = MIMEMultipart()
        message["From"] = smtp_user
        message["To"] = to_email
        message["Subject"] = subject
        message.attach(MIMEText(body, "plain"))

        try:
            # Uncomment and configure for real email sending
            # with smtplib.SMTP(smtp_server, smtp_port) as server:
            #     server.starttls()
            #     server.login(smtp_user, smtp_password)
            #     server.send_message(message)
            print(f"Mocking email to {to_email}: {subject}")
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False
