from django.db import models

class SiteConfig(models.Model):
    key = models.CharField(max_length=64, unique=True, db_index=True)
    data = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.key} (updated {self.updated_at})"

class SystemAuditLog(models.Model):
    action = models.CharField(max_length=255)
    performed_by = models.CharField(max_length=128, default='system')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.created_at}] {self.action}"
