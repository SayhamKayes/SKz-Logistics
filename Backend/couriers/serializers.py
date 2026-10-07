from rest_framework import serializers
from .models import Consignment, Milestone

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id', 'title', 'location', 'description', 'status', 'timestamp']

class ConsignmentSerializer(serializers.ModelSerializer):
    milestones = MilestoneSerializer(many=True, read_only=True)

    class Meta:
        model = Consignment
        fields = '__all__'
