from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Consignment, Milestone
from .serializers import ConsignmentSerializer, MilestoneSerializer

import re

def format_bd_time_str(time_raw):
    """Normalize any time string (e.g. '13:46 pm', '14:00', '1:46pm') into clean 12-hour BD Time '01:46 PM'"""
    if not time_raw:
        return ''
    raw = str(time_raw).strip()
    match = re.match(r'^(\d{1,2}):(\d{2})', raw)
    if match:
        hour = int(match.group(1))
        minute = match.group(2)
        lower = raw.lower()
        if 'pm' in lower and hour < 12:
            ampm = 'PM'
        elif 'am' in lower and hour == 12:
            hour = 12
            ampm = 'AM'
        elif hour >= 12:
            ampm = 'PM'
            if hour > 12:
                hour -= 12
        elif hour == 0:
            hour = 12
            ampm = 'AM'
        else:
            ampm = 'PM' if 'pm' in lower else 'AM'
        return f"{hour:02d}:{minute} {ampm}"
    return raw[:60]

def save_milestones_safely(consignment, milestones_data):
    if not milestones_data or not isinstance(milestones_data, list):
        return
    try:
        consignment.milestones.all().delete()
        for m in milestones_data:
            if not isinstance(m, dict):
                continue
            raw_time = str(m.get('time_str') or m.get('time') or '')
            clean_time = format_bd_time_str(raw_time)
            Milestone.objects.create(
                consignment=consignment,
                title=str(m.get('title') or m.get('status') or 'Update')[:250],
                location=str(m.get('location') or 'Dhaka')[:250],
                description=str(m.get('description') or ''),
                status=str(m.get('status') or 'In Transit')[:60],
                date_str=str(m.get('date_str') or m.get('date') or '')[:120],
                time_str=clean_time[:60],
                updated_by=str(m.get('updated_by') or 'SAIN International Logistics')[:250],
                remarks=str(m.get('remarks') or '')[:500]
            )
    except Exception as e:
        print(f"Warning: Milestone sync error: {e}")


def clean_data_for_mysql(data):
    if not isinstance(data, dict):
        return data
    cleaned = dict(data)
    for k, v in list(cleaned.items()):
        if isinstance(v, str):
            # Replace Bengali Taka sign ৳ with BDT to prevent MySQL (1366, "Incorrect string value") on latin1 tables
            cleaned[k] = v.replace('\u09F3', 'BDT ').strip()
    return cleaned


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

        clean_payload = clean_data_for_mysql(request.data)
        milestones_data = clean_payload.get('milestones', None)
        serializer = ConsignmentSerializer(consignment, data=clean_payload, partial=True)
        if serializer.is_valid():
            try:
                saved_consignment = serializer.save()
                save_milestones_safely(saved_consignment, milestones_data)
                return Response(ConsignmentSerializer(saved_consignment).data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": f"Database save error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
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
        clean_payload = clean_data_for_mysql(request.data)
        consignment_no = clean_payload.get('consignment_no', '').strip()
        if not consignment_no:
            return Response({"error": "consignment_no is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if already exists; if so, update
        existing = Consignment.objects.filter(consignment_no__iexact=consignment_no).first()
        milestones_data = clean_payload.get('milestones', None)
        if existing:
            serializer = ConsignmentSerializer(existing, data=clean_payload, partial=True)
        else:
            serializer = ConsignmentSerializer(data=clean_payload, partial=True)

        if serializer.is_valid():
            try:
                saved_consignment = serializer.save()
                save_milestones_safely(saved_consignment, milestones_data)
                return Response(ConsignmentSerializer(saved_consignment).data, status=status.HTTP_200_OK if existing else status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": f"Database save error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
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
