from django.contrib import admin
from django.urls import path, include
from api.views import health_check

urlpatterns = [
    path('', health_check, name='root-health'),
    path('sain-sakib/', admin.site.urls),
    # path('admin/', admin.site.urls),
    path('api/v1/', include('api.urls')),
    path('api/v1/couriers/', include('couriers.urls')),
    path('api/v1/order/', include('order.urls')),
    path('api/v1/products/', include('products.urls')),
    path('api/v1/users/', include('users.urls')),
]
