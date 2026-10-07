from django.apps import AppConfig
from django.db import models
from django.contrib.auth.models import User

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('ADMIN', 'SAIN Admin Officer'),
        ('COURIER', 'Field Delivery Driver'),
        ('CUSTOMS_AGENT', 'Customs Clearing Agent'),
        ('CLIENT', 'Importer / Client'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=32, choices=ROLE_CHOICES, default='CLIENT')
    company_name = models.CharField(max_length=128, blank=True)
    phone = models.CharField(max_length=32, blank=True)
    bin_number = models.CharField(max_length=64, blank=True, help_text="Business Identification Number for Customs Act 2023")

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"
