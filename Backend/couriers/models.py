from django.db import models

class Consignment(models.Model):
    STATUS_CHOICES = [
        ('RECEIVED', 'Received at Warehouse'),
        ('IN_TRANSIT', 'In Transit'),
        ('AT_HUB', 'At Sorting Hub'),
        ('CUSTOMS', 'Customs Clearance (Act 2023)'),
        ('OUT_FOR_DELIVERY', 'Out for Doorstep Delivery'),
        ('DELIVERED', 'Delivered'),
    ]

    SERVICE_CHOICES = [
        ('AIR_PRIORITY', 'Air Freight Priority'),
        ('SEA_FREIGHT', 'Sea Freight (FCL/LCL)'),
        ('HAND_CARRY', 'Hand Carry Express'),
        ('EXPORT_WORLDWIDE', 'Export Worldwide'),
    ]

    consignment_no = models.CharField(max_length=64, unique=True, db_index=True)
    reference_no = models.CharField(max_length=64, blank=True, null=True)
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='RECEIVED')
    service_type = models.CharField(max_length=32, choices=SERVICE_CHOICES, default='AIR_PRIORITY')
    carrier = models.CharField(max_length=128, default='SAIN Direct Freight Network')
    awb_number = models.CharField(max_length=64, blank=True, null=True)

    # Corridor
    origin_city = models.CharField(max_length=128, default='Guangzhou')
    origin_hub = models.CharField(max_length=255, default='SAIN Guangzhou Terminal, Baiyun')
    origin_country = models.CharField(max_length=64, default='China')
    origin_code = models.CharField(max_length=10, default='CAN')

    destination_city = models.CharField(max_length=128, default='Dhaka')
    destination_address = models.CharField(max_length=255, default='Sector 3, Uttara, Dhaka-1230')
    destination_country = models.CharField(max_length=64, default='Bangladesh')
    destination_code = models.CharField(max_length=10, default='DAC')

    # Cargo Specs
    pieces = models.PositiveIntegerField(default=1)
    weight_kg = models.DecimalField(max_digits=10, decimal_places=2, default=25.0)
    dimensions = models.CharField(max_length=128, default='Standard Export Packaging')
    volume_cbm = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    cargo_description = models.TextField(default='Commercial Freight Goods')
    hs_code = models.CharField(max_length=32, blank=True, null=True)

    # Customs Act 2023 Compliance
    customs_act = models.CharField(max_length=128, default='Bangladesh Customs Act 2023 Compliant')
    trade_term = models.CharField(max_length=32, default='CFR Dhaka')
    duty_cleared = models.BooleanField(default=False)
    duty_status = models.CharField(max_length=128, default='Duty Assessed & Cleared')
    assessment_station = models.CharField(max_length=255, default='Hazrat Shahjalal International Airport Customs House')

    # Consignee
    consignee_name = models.CharField(max_length=128)
    consignee_phone = models.CharField(max_length=32)

    progress_percentage = models.PositiveIntegerField(default=20)
    estimated_delivery = models.CharField(max_length=128, default='Within 48 hours')
    departure_date = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.consignment_no} - {self.get_status_display()}"


class Milestone(models.Model):
    consignment = models.ForeignKey(Consignment, related_name='milestones', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=32, default='completed') # completed, current, pending
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.consignment.consignment_no} - {self.title} at {self.location}"
