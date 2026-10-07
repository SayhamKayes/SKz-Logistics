from django.apps import AppConfig
from django.db import models

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

class SystemAuditLog(models.Model):
    action = models.CharField(max_length=255)
    performed_by = models.CharField(max_length=128, default='system')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.created_at}] {self.action}"
