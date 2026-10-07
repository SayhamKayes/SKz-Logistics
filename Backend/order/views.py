from rest_framework import generics
from .models import ShippingOrder
from .serializers import ShippingOrderSerializer

class ShippingOrderListCreateView(generics.ListCreateAPIView):
    queryset = ShippingOrder.objects.all().order_by('-created_at')
    serializer_class = ShippingOrderSerializer
