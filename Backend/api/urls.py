from django.urls import path
from .views import (
    health_check,
    send_contact_email,
    test_smtp_connection,
    forgot_password,
    reset_password,
    get_all_site_configs,
    site_config_detail,
)

urlpatterns = [
    path('health/', health_check, name='api-health'),
    path('contact/send-email/', send_contact_email, name='contact-send-email'),
    path('contact/test-smtp/', test_smtp_connection, name='contact-test-smtp'),
    path('auth/forgot-password/', forgot_password, name='auth-forgot-password'),
    path('auth/reset-password/', reset_password, name='auth-reset-password'),
    path('config/', get_all_site_configs, name='site-config-list'),
    path('config/<str:key>/', site_config_detail, name='site-config-detail'),
]
