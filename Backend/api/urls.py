from django.urls import path
from .views import (
    health_check,
    send_contact_email,
    test_smtp_connection,
    forgot_password,
    reset_password,
)

urlpatterns = [
    path('health/', health_check, name='api-health'),
    path('contact/send-email/', send_contact_email, name='contact-send-email'),
    path('contact/test-smtp/', test_smtp_connection, name='contact-test-smtp'),
    path('auth/forgot-password/', forgot_password, name='auth-forgot-password'),
    path('auth/reset-password/', reset_password, name='auth-reset-password'),
]


