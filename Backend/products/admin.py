from django.contrib import admin
from .models import LogisticsRate

@admin.register(LogisticsRate)
class LogisticsRateAdmin(admin.ModelAdmin):
    list_display = ('service_name', 'origin_region', 'destination_region', 'price_per_kg_usd', 'estimated_transit_days', 'is_active')
    list_filter = ('is_active', 'service_name')
