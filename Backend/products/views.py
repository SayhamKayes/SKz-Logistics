from django.apps import AppConfig
from rest_framework import serializers, generics
from django.urls import path
from django.contrib import admin
from .models import LogisticsRate

class ProductsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'products'

class LogisticsRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogisticsRate
        fields = '__all__'

class LogisticsRateListView(generics.ListAPIView):
    queryset = LogisticsRate.objects.filter(is_active=True)
    serializer_class = LogisticsRateSerializer
