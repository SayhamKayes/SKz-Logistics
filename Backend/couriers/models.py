from django.db import models

class Consignment(models.Model):
    consignment_no = models.CharField(max_length=64, unique=True, db_index=True)
    reference_no = models.CharField(max_length=64, blank=True, null=True)
    status = models.CharField(max_length=64, default='At Bangladesh warehouse', blank=True)
    service_type = models.CharField(max_length=64, default='Air Freight Priority', blank=True)
    carrier = models.CharField(max_length=128, default='SAIN Direct Freight Network', blank=True)
    awb_number = models.CharField(max_length=64, blank=True, null=True)

    # Corridor
    origin_city = models.CharField(max_length=128, default='Guangzhou', blank=True)
    origin_hub = models.CharField(max_length=255, default='SAIN Guangzhou Terminal, Baiyun', blank=True)
    origin_country = models.CharField(max_length=64, default='China', blank=True)
    origin_code = models.CharField(max_length=10, default='CAN', blank=True)

    destination_city = models.CharField(max_length=128, default='Dhaka', blank=True)
    destination_address = models.CharField(max_length=255, default='Sector 3, Uttara, Dhaka-1230', blank=True)
    destination_country = models.CharField(max_length=64, default='Bangladesh', blank=True)
    destination_code = models.CharField(max_length=10, default='DAC', blank=True)

    # Cargo Specs
    pieces = models.PositiveIntegerField(default=1)
    weight_kg = models.DecimalField(max_digits=10, decimal_places=2, default=25.0)
    dimensions = models.CharField(max_length=128, default='Standard Export Packaging', blank=True)
    volume_cbm = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)
    cargo_description = models.TextField(default='Commercial Freight Goods', blank=True)
    hs_code = models.CharField(max_length=32, blank=True, null=True)

    # Customs Act 2023 Compliance
    customs_act = models.CharField(max_length=128, default='Bangladesh Customs Act 2023 Compliant', blank=True)
    trade_term = models.CharField(max_length=32, default='CFR Dhaka', blank=True)
    duty_cleared = models.BooleanField(default=False)
    duty_status = models.CharField(max_length=128, default='Duty Assessed & Cleared', blank=True)
    assessment_station = models.CharField(max_length=255, default='Hazrat Shahjalal International Airport Customs House', blank=True)

    # Shipper Details
    shipper_name = models.CharField(max_length=255, default='SAIN', blank=True)
    shipper_phone = models.CharField(max_length=64, default='+880171906999', blank=True)
    shipper_address = models.CharField(max_length=512, default='15/B, Uttara Metro Center, Dhaka 1230 Bangladesh', blank=True)
    shipper_email = models.CharField(max_length=128, default='saininternationallogistics@gmail.com', blank=True)

    # Receiver Details
    receiver_name = models.CharField(max_length=255, blank=True, default='Muhammad Tahin')
    receiver_phone = models.CharField(max_length=64, blank=True, default='+8801731939325')
    receiver_address = models.CharField(max_length=512, blank=True, default='Basundhara Residential Area, Dhaka, D-block road 1, House: 252')
    receiver_email = models.CharField(max_length=128, blank=True, default='ocuna123@gmail.com')

    # Extended Shipment Details (matching admin panel)
    type_of_shipment = models.CharField(max_length=64, default='Air Freight', blank=True)
    weight_text = models.CharField(max_length=64, default='around 1500g', blank=True)
    packages_count = models.CharField(max_length=32, default='7', blank=True)
    product = models.CharField(max_length=255, blank=True, default='Keychain, Doll, Acrylic sheet')
    payment_mode = models.CharField(max_length=64, default='CASH', blank=True)
    departure_time_str = models.CharField(max_length=64, blank=True, default='18:52 pm')
    pickup_time_str = models.CharField(max_length=64, blank=True, default='')
    quantity = models.CharField(max_length=64, default='7 Box', blank=True)
    total_freight = models.CharField(max_length=64, blank=True, default='')
    carrier_reference_no = models.CharField(max_length=64, blank=True, default='')
    pickup_date = models.CharField(max_length=64, blank=True, default='')
    expected_delivery_date = models.CharField(max_length=64, blank=True, default='')
    comments = models.TextField(blank=True, default='Total 7 store product.')
    
    # Packages table data (JSON)
    packages_data = models.JSONField(default=list, blank=True)
    
    # Metadata & Admin controls
    tags = models.CharField(max_length=255, blank=True, default='Guangzhou')
    category = models.CharField(max_length=255, blank=True, default='Keychain Mix')
    client = models.CharField(max_length=128, blank=True, default='')
    agent_name = models.CharField(max_length=128, blank=True, default='')
    employee = models.CharField(max_length=128, blank=True, default='')
    published_status = models.CharField(max_length=64, default='Published', blank=True)

    # Consignee
    consignee_name = models.CharField(max_length=128, default='Muhammad Tahin', blank=True)
    consignee_phone = models.CharField(max_length=32, default='+8801731939325', blank=True)

    progress_percentage = models.PositiveIntegerField(default=20)
    estimated_delivery = models.CharField(max_length=128, default='Within 48 hours', blank=True)
    departure_date = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.consignment_no} - {self.status}"


class Milestone(models.Model):
    consignment = models.ForeignKey(Consignment, related_name='milestones', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    status = models.CharField(max_length=64, default='In Transit') # Pending, Received, In Transit, At Bangladesh warehouse, etc.
    date_str = models.CharField(max_length=32, blank=True, default='')
    time_str = models.CharField(max_length=32, blank=True, default='')
    updated_by = models.CharField(max_length=128, blank=True, default='SAIN International Logistics')
    remarks = models.CharField(max_length=255, blank=True, default='')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.consignment.consignment_no} - {self.title} at {self.location}"

