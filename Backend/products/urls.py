from django.urls import path
from .views import LogisticsRateListView

urlpatterns = [
    path('rates/', LogisticsRateListView.as_view(), name='rates-list'),
]
