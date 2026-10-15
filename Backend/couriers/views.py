from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Consignment, Milestone
from .serializers import ConsignmentSerializer, MilestoneSerializer

class TrackConsignmentView(APIView):
    """
    GET, PUT, PATCH, DELETE /api/v1/couriers/track/<consignment_no>/
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

    def put(self, request, consignment_no):
        return self.patch(request, consignment_no)

    def patch(self, request, consignment_no):
        clean_no = consignment_no.strip()
        try:
            consignment = Consignment.objects.get(consignment_no__iexact=clean_no)
        except Consignment.DoesNotExist:
            # Create if not exists on save
            consignment = Consignment(consignment_no=clean_no)

        milestones_data = request.data.get('milestones', None)
        serializer = ConsignmentSerializer(consignment, data=request.data, partial=True)
        if serializer.is_valid():
            saved_consignment = serializer.save()
            if milestones_data is not None and isinstance(milestones_data, list):
                saved_consignment.milestones.all().delete()
                for m in milestones_data:
                    Milestone.objects.create(
                        consignment=saved_consignment,
                        title=m.get('title', m.get('status', 'Update')),
                        location=m.get('location', 'Dhaka'),
                        description=m.get('description', ''),
                        status=m.get('status', 'In Transit'),
                        date_str=m.get('date_str', m.get('date', '')),
                        time_str=m.get('time_str', m.get('time', '')),
                        updated_by=m.get('updated_by', 'SAIN International Logistics'),
                        remarks=m.get('remarks', '')
                    )
            return Response(ConsignmentSerializer(saved_consignment).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, consignment_no):
        clean_no = consignment_no.strip()
        try:
            consignment = Consignment.objects.get(consignment_no__iexact=clean_no)
            consignment.delete()
            return Response({"success": True, "message": "Consignment deleted"}, status=status.HTTP_200_OK)
        except Consignment.DoesNotExist:
            return Response({"error": "Consignment not found"}, status=status.HTTP_404_NOT_FOUND)

class ConsignmentListCreateView(APIView):
    def get(self, request):
        consignments = Consignment.objects.all().order_by('-created_at')[:100]
        serializer = ConsignmentSerializer(consignments, many=True)
        return Response(serializer.data)

    def post(self, request):
        consignment_no = request.data.get('consignment_no', '').strip()
        if not consignment_no:
            return Response({"error": "consignment_no is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if already exists; if so, update
        existing = Consignment.objects.filter(consignment_no__iexact=consignment_no).first()
        milestones_data = request.data.get('milestones', None)
        if existing:
            serializer = ConsignmentSerializer(existing, data=request.data, partial=True)
        else:
            serializer = ConsignmentSerializer(data=request.data, partial=True)

        if serializer.is_valid():
            saved_consignment = serializer.save()
            if milestones_data is not None and isinstance(milestones_data, list):
                saved_consignment.milestones.all().delete()
                for m in milestones_data:
                    Milestone.objects.create(
                        consignment=saved_consignment,
                        title=m.get('title', m.get('status', 'Update')),
                        location=m.get('location', 'Dhaka'),
                        description=m.get('description', ''),
                        status=m.get('status', 'In Transit'),
                        date_str=m.get('date_str', m.get('date', '')),
                        time_str=m.get('time_str', m.get('time', '')),
                        updated_by=m.get('updated_by', 'SAIN International Logistics'),
                        remarks=m.get('remarks', '')
                    )
            return Response(ConsignmentSerializer(saved_consignment).data, status=status.HTTP_200_OK if existing else status.HTTP_201_CREATED)
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
