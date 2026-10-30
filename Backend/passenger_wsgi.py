import os
import sys

# -----------------------------------------------------------------------------
# cPanel Phusion Passenger WSGI Entrypoint for SAIN International Logistics
# -----------------------------------------------------------------------------

# Add application directory to sys.path
APP_DIR = os.path.dirname(os.path.abspath(__file__))
if APP_DIR not in sys.path:
    sys.path.insert(0, APP_DIR)

# Set default settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sain.settings')

# Initialize Django WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

# Safe auto-migration on boot (Zero-Terminal automation)
try:
    from django.core.management import call_command
    call_command('migrate', interactive=False)
except Exception:
    pass

# Ensure administrator exists in MySQL auth_user table on boot
try:
    from django.contrib.auth import get_user_model
    User = get_user_model()
    admin_user = os.getenv('ADMIN_USERNAME', 'sain_sakib').strip() or 'sain_sakib'
    admin_pass = os.getenv('ADMIN_PASSWORD', 'sain_sakib6055').strip() or 'sain_sakib6055'
    admin_email = os.getenv('ADMIN_EMAIL', 'saininternationallogistics@gmail.com').strip() or 'saininternationallogistics@gmail.com'

    if not User.objects.filter(username__iexact=admin_user).exists():
        User.objects.create_superuser(
            username=admin_user,
            email=admin_email,
            password=admin_pass
        )
except Exception:
    pass

