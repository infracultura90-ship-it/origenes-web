import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self):
        self.smtp_host = "smtp.gmail.com"
        self.smtp_port = 587
        self.sender_email = os.environ.get('GMAIL_USER', 'infracultura90@gmail.com')
        self.sender_password = os.environ.get('GMAIL_APP_PASSWORD', '')
        
    def send_contact_notification(self, contact_data):
        """
        Send email notification when a new contact inquiry is received.
        """
        try:
            # Check if credentials are configured
            if not self.sender_password:
                logger.warning("Gmail App Password not configured. Email notification skipped.")
                return False
            
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = f"Nueva Consulta - {contact_data['name']}"
            message["From"] = self.sender_email
            message["To"] = self.sender_email
            
            # Email body in HTML
            html_body = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #2d5016; border-bottom: 3px solid #d97706; padding-bottom: 10px;">
                            Nueva Consulta - ORÍGENES
                        </h2>
                        
                        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #d97706; margin-top: 0;">Información del Cliente</h3>
                            <p><strong>Nombre:</strong> {contact_data['name']}</p>
                            <p><strong>Email:</strong> <a href="mailto:{contact_data['email']}">{contact_data['email']}</a></p>
                            <p><strong>Teléfono:</strong> {contact_data['phone']}</p>
                            <p><strong>Departamento:</strong> {contact_data['department']}</p>
                            <p><strong>Cultivo:</strong> {contact_data['culture']}</p>
                            {f"<p><strong>Hectáreas:</strong> {contact_data.get('hectares', 'No especificado')}</p>" if contact_data.get('hectares') else ""}
                        </div>
                        
                        <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #2d5016;">
                            <h3 style="color: #2d5016; margin-top: 0;">Mensaje</h3>
                            <p style="white-space: pre-wrap;">{contact_data['message']}</p>
                        </div>
                        
                        <div style="margin-top: 20px; padding: 15px; background-color: #fff7ed; border-radius: 8px;">
                            <p style="margin: 0; font-size: 14px; color: #92400e;">
                                <strong>ID de consulta:</strong> {contact_data.get('id', 'N/A')}<br>
                                <strong>Fecha:</strong> {contact_data.get('created_at', 'N/A')}
                            </p>
                        </div>
                    </div>
                </body>
            </html>
            """
            
            # Attach HTML body
            html_part = MIMEText(html_body, "html")
            message.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(message)
            
            logger.info(f"Email notification sent for contact: {contact_data['email']}")
            return True
            
        except Exception as e:
            logger.error(f"Error sending email notification: {str(e)}")
            return False


# Singleton instance
email_service = EmailService()
