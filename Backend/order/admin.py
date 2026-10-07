from django.contrib import admin
from .models import ShippingOrder

@admin.register(ShippingOrder)
class ShippingOrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer_name', 'service_type', 'origin', 'destination', 'weight_kg', 'status')
    search_fields = ('order_number', 'customer_name', 'customer_phone')
    list_filter = ('status', 'service_type')
