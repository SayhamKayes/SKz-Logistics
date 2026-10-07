from django.contrib import admin
from .models import Consignment, Milestone

class MilestoneInline(admin.TabularInline):
    model = Milestone
    extra = 1

@admin.register(Consignment)
class ConsignmentAdmin(admin.ModelAdmin):
    list_display = ('consignment_no', 'status', 'service_type', 'origin_city', 'destination_city', 'weight_kg', 'duty_cleared')
    search_fields = ('consignment_no', 'reference_no', 'consignee_name')
    list_filter = ('status', 'service_type', 'duty_cleared')
    inlines = [MilestoneInline]

@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ('consignment', 'title', 'location', 'status', 'timestamp')
    search_fields = ('title', 'location', 'consignment__consignment_no')
