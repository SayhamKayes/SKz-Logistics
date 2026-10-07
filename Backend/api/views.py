from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def health_check(request):
    return Response({
        "status": "online",
        "service": "SAIN International Logistics API",
        "version": "1.0.0",
        "jurisdiction": "Bangladesh Customs Act 2023 Compliant",
        "headquarters": "Uttara, Dhaka, Bangladesh",
    })
