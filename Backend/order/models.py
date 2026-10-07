from django.db import models

class ShippingOrder(models.Model):
    ORDER_STATUS = [
        ('PENDING', 'Pending Quote Review'),
        ('CONFIRMED', 'Booking Confirmed'),
        ('CARGO_COLLECTED', 'Cargo Collected'),
        ('IN_TRANSIT', 'In Transit'),
        ('COMPLETED', 'Delivered & Invoiced'),
        ('CANCELLED', 'Cancelled'),
    ]

    order_number = models.CharField(max_length=64, unique=True)
    customer_name = models.CharField(max_length=128)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=32)
    service_type = models.CharField(max_length=64)
    origin = models.CharField(max_length=128)
    destination = models.CharField(max_length=128)
    weight_kg = models.DecimalField(max_digits=10, decimal_places=2)
    volume_cbm = models.DecimalField(max_digits=10, decimal_places=3, default=0.1)
    status = models.CharField(max_length=32, choices=ORDER_STATUS, default='PENDING')
    estimated_cost_bdt = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.order_number} - {self.customer_name}"
