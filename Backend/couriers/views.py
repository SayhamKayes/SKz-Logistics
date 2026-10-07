from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Consignment, Milestone
from .serializers import ConsignmentSerializer, MilestoneSerializer

class TrackConsignmentView(APIView):
    """
    GET /api/v1/couriers/track/<consignment_no>/
    Endpoint matching saininternationallogistics.com consignment tracker.
    """
    def get(self, request, consignment_no):
        clean_no = consignment_no.strip()
        try:
            consignment = Consignment.objects.get(consignment_no__iexact=clean_no)
            serializer = ConsignmentSerializer(consignment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Consignment.DoesNotExist:
            return Response(
                {"error": f"Consignment '{consignment_no}' not found."},
                status=status.HTTP_404_NOT_FOUND
            )

class ConsignmentListCreateView(APIView):
    def get(self, request):
        consignments = Consignment.objects.all().order_by('-created_at')[:50]
        serializer = ConsignmentSerializer(consignments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ConsignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddMilestoneView(APIView):
    def post(self, request, consignment_no):
        try:
            consignment = Consignment.objects.get(consignment_no__iexact=consignment_no)
            serializer = MilestoneSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(consignment=consignment)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Consignment.DoesNotExist:
            return Response({"error": "Consignment not found"}, status=status.HTTP_404_NOT_FOUND)
