"""
Utility script to create or reset the Superuser in MySQL database.
Usage in cPanel terminal or command prompt:
    python init_admin.py [username] [password] [email]
"""
import os
import sys
import django

# Set up Django environment
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sain.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

def setup_admin():
    username = sys.argv[1] if len(sys.argv) > 1 else os.getenv('ADMIN_USERNAME', 'sain_sakib').strip()
    password = sys.argv[2] if len(sys.argv) > 2 else os.getenv('ADMIN_PASSWORD', 'sain_sakib6055').strip()
    email = sys.argv[3] if len(sys.argv) > 3 else os.getenv('ADMIN_EMAIL', 'saininternationallogistics@gmail.com').strip()

    print(f"[*] Checking user: {username} in MySQL database...")
    user = User.objects.filter(username__iexact=username).first()
    if user:
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.email = email
        user.save()
        print(f"[+] User '{username}' updated successfully with new password!")
    else:
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f"[+] Superuser '{username}' created successfully in MySQL!")

    print(f"[*] Total users in database: {User.objects.count()}")

if __name__ == '__main__':
    setup_admin()
