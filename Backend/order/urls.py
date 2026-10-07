from django.urls import path
from .views import ShippingOrderListCreateView

urlpatterns = [
    path('', ShippingOrderListCreateView.as_view(), name='orders-list-create'),
]
