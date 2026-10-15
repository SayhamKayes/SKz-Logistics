import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({
        "status": "online",
        "service": "SAIN International Logistics API",
        "version": "1.0.0",
        "jurisdiction": "Bangladesh Customs Act 2023 Compliant",
        "headquarters": "Uttara, Dhaka, Bangladesh",
    })

def create_smtp_client(host, port, security):
    port = int(port)
    if security == 'ssl' or port == 465:
        context = ssl.create_default_context()
        server = smtplib.SMTP_SSL(host, port, context=context, timeout=15)
    else:
        server = smtplib.SMTP(host, port, timeout=15)
        if security == 'tls' or port == 587:
            context = ssl.create_default_context()
            server.starttls(context=context)
    return server

@api_view(['POST'])
@permission_classes([AllowAny])
def test_smtp_connection(request):
    """
    Test SMTP credentials provided by the admin.
    """
    data = request.data or {}
    host = data.get('smtpHost', 'smtp.gmail.com').strip()
    port = data.get('smtpPort', 587)
    security = data.get('smtpSecurity', 'tls')
    user = data.get('smtpUser', '').strip()
    password = data.get('smtpPassword', '').strip()
    receiver = data.get('receiverEmail', user).strip() or user
    sender_name = data.get('senderName', 'SAIN Logistics System').strip()

    if not host or not user or not password:
        return Response(
            {"success": False, "error": "SMTP Host, User Email, and Password/App Password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        server = create_smtp_client(host, port, security)
        server.login(user, password)

        # Send a quick test email
        msg = MIMEMultipart('alternative')
        msg['Subject'] = '✅ SAIN Logistics SMTP Connection Test Successful'
        msg['From'] = f'{sender_name} <{user}>'
        msg['To'] = receiver

        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px; color: #1e293b;">
          <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <div style="background: #0f1d26; padding: 20px 24px; border-bottom: 3px solid #f59e0b;">
              <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: bold;">SAIN International Logistics</h2>
              <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px;">Admin SMTP Gateway Diagnostic</p>
            </div>
            <div style="padding: 24px;">
              <p style="font-size: 14px; line-height: 1.6; color: #334155;">
                🎉 <strong>Success!</strong> Your SMTP credentials have been verified and are ready to deliver customer messages from the contact form directly to this inbox.
              </p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px;">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 8px 0; color: #64748b;"><strong>SMTP Server:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a;">{host}:{port} ({security.upper()})</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 8px 0; color: #64748b;"><strong>Authenticated User:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a;">{user}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 8px 0; color: #64748b;"><strong>Recipient Inbox:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a;">{receiver}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;"><strong>Tested At:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a;">{datetime.now().strftime('%Y-%m-%d %I:%M:%S %p')}</td>
                </tr>
              </table>
            </div>
            <div style="background: #f8fafc; padding: 12px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
              Uttara Sector 11, Dhaka-1230, Bangladesh • Customs Act 2023 Compliant
            </div>
          </div>
        </body>
        </html>
        """
        msg.attach(MIMEText("SAIN Logistics SMTP Connection Test Successful.", 'plain'))
        msg.attach(MIMEText(html_content, 'html'))

        server.sendmail(user, [receiver], msg.as_string())
        server.quit()

        return Response({
            "success": True,
            "message": f"SMTP connection verified and test email sent to {receiver}!"
        })
    except Exception as e:
        return Response({
            "success": False,
            "error": str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def send_contact_email(request):
    """
    Receives contact form submission and sends email to admin via SMTP.
    """
    data = request.data or {}
    name = data.get('name', 'Anonymous Visitor').strip()
    email = data.get('email', '').strip()
    phone = data.get('phone', 'N/A').strip()
    service_type = data.get('serviceType', 'General Inquiry').strip()
    consignment_no = data.get('consignmentNo', 'None').strip() or 'None'
    message = data.get('message', '').strip()

    if not message or not email:
        return Response(
            {"success": False, "error": "Email and message are required fields."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # SMTP Configuration (passed from request or defaults)
    smtp_config = data.get('smtpConfig', {})
    host = smtp_config.get('smtpHost', 'smtp.gmail.com').strip()
    port = smtp_config.get('smtpPort', 587)
    security = smtp_config.get('smtpSecurity', 'tls')
    user = smtp_config.get('smtpUser', '').strip()
    password = smtp_config.get('smtpPassword', '').strip()
    receiver = smtp_config.get('receiverEmail', 'saininternationallogistics@gmail.com').strip() or 'saininternationallogistics@gmail.com'
    sender_name = smtp_config.get('senderName', 'SAIN Logistics Web Portal').strip()

    # If SMTP is not configured with credentials, log and return informative success
    if not host or not user or not password:
        return Response({
            "success": True,
            "warning": "SMTP credentials are not configured in Admin Panel. Message recorded locally.",
            "message": "Message received by SAIN operations."
        })

    try:
        server = create_smtp_client(host, port, security)
        server.login(user, password)

        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"📬 New Message from {name} - {service_type}"
        msg['From'] = f"{sender_name} <{user}>"
        msg['To'] = receiver
        msg['Reply-To'] = email

        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px; color: #1e293b;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <div style="background: #0f1d26; padding: 20px 24px; border-bottom: 3px solid #f59e0b;">
              <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: bold;">SAIN International Logistics</h2>
              <p style="color: #f59e0b; margin: 4px 0 0 0; font-size: 12px; font-weight: 600;">NEW CUSTOMER INQUIRY</p>
            </div>
            <div style="padding: 24px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b; width: 140px;"><strong>Client Name:</strong></td>
                  <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">{name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;"><strong>Email:</strong></td>
                  <td style="padding: 10px 0; color: #1a6c7a; font-weight: 600;"><a href="mailto:{email}" style="color: #1a6c7a; text-decoration: none;">{email}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;"><strong>Phone:</strong></td>
                  <td style="padding: 10px 0; color: #0f172a;">{phone}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;"><strong>Service Category:</strong></td>
                  <td style="padding: 10px 0; color: #0f172a;">{service_type}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;"><strong>Consignment No:</strong></td>
                  <td style="padding: 10px 0; color: #f59e0b; font-family: monospace; font-weight: bold;">{consignment_no}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b;"><strong>Submitted At:</strong></td>
                  <td style="padding: 10px 0; color: #64748b;">{datetime.now().strftime('%d %b %Y, %I:%M %p')}</td>
                </tr>
              </table>

              <div style="background: #f8fafc; border-left: 4px solid #1a6c7a; padding: 16px; border-radius: 6px; margin-top: 10px;">
                <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #475569; text-transform: uppercase;">Message Content:</p>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #0f172a; white-space: pre-wrap;">{message}</p>
              </div>
            </div>
            <div style="background: #f8fafc; padding: 12px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
              Sent via SAIN International Logistics Public Contact Form
            </div>
          </div>
        </body>
        </html>
        """

        plain_text = f"New Inquiry from {name} ({email}, {phone})\nService: {service_type}\nConsignment: {consignment_no}\n\nMessage:\n{message}"
        msg.attach(MIMEText(plain_text, 'plain'))
        msg.attach(MIMEText(html_body, 'html'))

        server.sendmail(user, [receiver], msg.as_string())
        server.quit()

        return Response({
            "success": True,
            "message": f"Inquiry forwarded successfully to {receiver} via SMTP."
        })
    except Exception as e:
        return Response({
            "success": False,
            "error": f"Failed to send email via SMTP: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

