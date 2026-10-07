from django.db import models

class LogisticsRate(models.Model):
    service_name = models.CharField(max_length=64)
    origin_region = models.CharField(max_length=64, default='Guangzhou / South China')
    destination_region = models.CharField(max_length=64, default='Dhaka / Bangladesh')
    price_per_kg_usd = models.DecimalField(max_digits=6, decimal_places=2)
    price_per_cbm_usd = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    estimated_transit_days = models.CharField(max_length=64, default='2-4 Days')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.service_name} ({self.origin_region} -> {self.destination_region})"
