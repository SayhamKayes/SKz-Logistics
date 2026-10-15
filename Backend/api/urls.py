from django.urls import path
from .views import health_check, send_contact_email, test_smtp_connection

urlpatterns = [
    path('health/', health_check, name='api-health'),
    path('contact/send-email/', send_contact_email, name='contact-send-email'),
    path('contact/test-smtp/', test_smtp_connection, name='contact-test-smtp'),
]

