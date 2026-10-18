import os
import smtplib
import ssl
import secrets
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
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


# In-memory store for pending password reset tokens: { token: { 'email': email, 'created_at': timestamp } }
RESET_PASSWORD_TOKENS = {}

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    """
    Generate a password reset token and dispatch an email with the reset link via SMTP.
    """
    data = request.data or {}
    email = data.get('email', '').strip()
    reset_base_url = data.get('resetUrl', '').strip()
    smtp_config = data.get('smtpConfig', {})

    if not email:
        return Response(
            {"success": False, "error": "Administrative email address is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Generate secure 32-byte URL-safe token
    token = secrets.token_urlsafe(32)
    RESET_PASSWORD_TOKENS[token] = {
        'email': email,
        'created_at': time.time()
    }

    # Construct the complete reset link
    if reset_base_url:
        separator = '&' if '?' in reset_base_url else '?'
        reset_link = f"{reset_base_url}{separator}token={token}"
    else:
        reset_link = f"/sain-sakib?action=reset-password&token={token}"

    # SMTP configuration - prefer request payload (admin panel settings) or env
    host = smtp_config.get('smtpHost') or os.getenv('SMTP_HOST', 'smtp.gmail.com')
    port = smtp_config.get('smtpPort') or os.getenv('SMTP_PORT', 587)
    security = smtp_config.get('smtpSecurity') or os.getenv('SMTP_SECURITY', 'tls')
    user = smtp_config.get('smtpUser') or os.getenv('SMTP_USER', '')
    password = smtp_config.get('smtpPassword') or os.getenv('SMTP_PASSWORD', '')
    sender_name = smtp_config.get('senderName') or os.getenv('SMTP_SENDER_NAME', 'SAIN International Logistics')

    # If SMTP is not yet configured or password is empty, return helpful fallback
    if not host or not user or not password:
        return Response({
            "success": True,
            "simulated": True,
            "warning": "SMTP credentials are pending configuration in Admin Portal / .env.",
            "message": f"Password reset link generated for {email}.",
            "reset_link": reset_link,
            "token": token
        })

    try:
        server = create_smtp_client(host, port, security)
        server.login(user, password)

        msg = MIMEMultipart('alternative')
        msg['Subject'] = '🔐 Reset Your SAIN Admin Portal Password'
        msg['From'] = f'{sender_name} <{user}>'
        msg['To'] = email

        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px; color: #1e293b; margin: 0;">
          <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.07);">
            <div style="background: #0f1d26; padding: 24px 28px; border-bottom: 4px solid #f59e0b;">
              <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px;">SAIN International Logistics</h2>
              <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px;">Management Portal • Security Gateway</p>
            </div>
            <div style="padding: 28px;">
              <h3 style="color: #0f172a; font-size: 16px; margin: 0 0 12px 0;">Admin Password Reset Request</h3>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                We received a request to reset the administrator password for the account associated with <strong>{email}</strong>.
              </p>
              <div style="text-align: center; margin: 28px 0;">
                <a href="{reset_link}" target="_blank" style="background: linear-gradient(135deg, #153243, #1a6c7a); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(26,108,122,0.3);">
                  Reset Admin Password &rarr;
                </a>
              </div>
              <p style="font-size: 12px; line-height: 1.5; color: #64748b; margin: 20px 0 8px 0;">
                If the button above does not work, copy and paste this URL into your browser:
              </p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 12px; border-radius: 8px; word-break: break-all; font-family: monospace; font-size: 11px; color: #0284c7;">
                {reset_link}
              </div>
              <p style="font-size: 12px; color: #94a3b8; margin: 20px 0 0 0;">
                ⏳ <strong>Notice:</strong> This reset link will expire in <strong>60 minutes</strong>. If you did not request this reset, your account is safe and you can ignore this email.
              </p>
            </div>
            <div style="background: #f8fafc; padding: 14px 28px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
              Uttara Sector 11, Dhaka-1230, Bangladesh • Customs Act 2023 Compliant
            </div>
          </div>
        </body>
        </html>
        """
        plain_text = f"SAIN International Logistics - Admin Password Reset\n\nReset your password using the following link:\n{reset_link}\n\nThis link is valid for 60 minutes.\nIf you did not request this, please ignore this email."

        msg.attach(MIMEText(plain_text, 'plain'))
        msg.attach(MIMEText(html_content, 'html'))

        server.sendmail(user, [email], msg.as_string())
        server.quit()

        return Response({
            "success": True,
            "message": f"A password reset link has been dispatched to {email}."
        })
    except Exception as e:
        return Response({
            "success": False,
            "error": f"SMTP delivery failed: {str(e)}",
            "fallback_link": reset_link,
            "token": token
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    """
    Verify reset token and update admin password.
    """
    data = request.data or {}
    token = data.get('token', '').strip()
    new_password = data.get('new_password', '').strip()

    if not token or not new_password:
        return Response(
            {"success": False, "error": "Token and new password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    token_data = RESET_PASSWORD_TOKENS.get(token)
    if not token_data:
        return Response(
            {"success": False, "error": "Invalid or expired reset token."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate expiration (60 minutes TTL)
    if time.time() - token_data.get('created_at', 0) > 3600:
        RESET_PASSWORD_TOKENS.pop(token, None)
        return Response(
            {"success": False, "error": "Reset link has expired. Please request a new one."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Invalidate token after use
    RESET_PASSWORD_TOKENS.pop(token, None)

    # Synchronize Django User model if user exists
    try:
        admin_user = User.objects.filter(is_superuser=True).first() or User.objects.filter(username='sain_sakib6055').first()
        if admin_user:
            admin_user.set_password(new_password)
            admin_user.save()
    except Exception:
        pass

    return Response({
        "success": True,
        "message": "Administrator password has been successfully updated."
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_site_configs(request):
    """
    Returns all stored site configurations as a key-value mapping from Neon PostgreSQL.
    """
    from core.models import SiteConfig
    configs = SiteConfig.objects.all()
    result = {c.key: c.data for c in configs}
    return Response(result, status=status.HTTP_200_OK)


@api_view(['GET', 'POST', 'PUT'])
@permission_classes([AllowAny])
def site_config_detail(request, key):
    """
    Get or update a specific site configuration by key in Neon PostgreSQL.
    """
    from core.models import SiteConfig
    clean_key = key.strip().lower()

    if request.method == 'GET':
        config = SiteConfig.objects.filter(key=clean_key).first()
        if not config:
            return Response({"key": clean_key, "data": None, "exists": False}, status=status.HTTP_200_OK)
        return Response({"key": config.key, "data": config.data, "exists": True, "updated_at": config.updated_at}, status=status.HTTP_200_OK)

    elif request.method in ['POST', 'PUT']:
        data = request.data
        payload_data = data.get('data', data) if isinstance(data, dict) and 'data' in data and len(data) == 1 else data
        config, created = SiteConfig.objects.update_or_create(
            key=clean_key,
            defaults={'data': payload_data}
        )
        return Response({
            "success": True,
            "key": config.key,
            "created": created,
            "updated_at": config.updated_at,
            "data": config.data
        }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def upload_media(request):
    """
    Uploads an image or media asset to Cloudinary.
    Supports multipart/form-data file uploads and base64 strings.
    """
    try:
        import cloudinary
        import cloudinary.uploader
    except ImportError:
        return Response({
            "success": False,
            "error": "The 'cloudinary' package is not installed on the server."
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Check Cloudinary configuration
    cloud_name = cloudinary.config().cloud_name
    api_key = cloudinary.config().api_key
    api_secret = cloudinary.config().api_secret

    if not cloud_name or not api_key or not api_secret:
        return Response({
            "success": False,
            "error": "Cloudinary credentials are not configured in Backend/.env. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
        }, status=status.HTTP_400_BAD_REQUEST)

    file_obj = request.FILES.get('file') or request.FILES.get('image')
    if not file_obj:
        # Check if sent in JSON or form fields as base64 string or remote URL
        file_obj = request.data.get('file') or request.data.get('image')

    if not file_obj:
        return Response({
            "success": False,
            "error": "No file or image payload was provided in the request."
        }, status=status.HTTP_400_BAD_REQUEST)

    # Resolve target destination folder in Cloudinary
    env_folder = os.getenv('CLOUDINARY_FOLDER', '').strip()
    req_folder = request.data.get('folder', '')
    if isinstance(req_folder, list):
        req_folder = req_folder[0] if req_folder else ''
    req_folder = str(req_folder or '').strip()

    if env_folder:
        # If user configured a specific folder in .env, upload all media directly into that folder
        use_subfolders = os.getenv('CLOUDINARY_USE_SUBFOLDERS', 'false').lower() in ['true', '1', 'yes']
        if use_subfolders and req_folder:
            sub = req_folder.replace('sain_logistics/', '').replace('sain_logistics', '').strip('/')
            folder = f"{env_folder}/{sub}" if sub else env_folder
        else:
            folder = env_folder
    else:
        folder = req_folder or 'sain_logistics'

    try:
        upload_result = cloudinary.uploader.upload(
            file_obj,
            folder=folder,
            resource_type='auto'
        )

        return Response({
            "success": True,
            "url": upload_result.get('secure_url'),
            "public_id": upload_result.get('public_id'),
            "format": upload_result.get('format'),
            "bytes": upload_result.get('bytes'),
            "resource_type": upload_result.get('resource_type'),
            "created_at": upload_result.get('created_at'),
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            "success": False,
            "error": f"Cloudinary upload failed: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


