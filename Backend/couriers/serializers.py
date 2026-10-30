from rest_framework import serializers
from .models import Consignment, Milestone

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = '__all__'

class ConsignmentSerializer(serializers.ModelSerializer):
    milestones = MilestoneSerializer(many=True, read_only=True)

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'tags' in data and isinstance(data['tags'], (list, tuple)):
            data['tags'] = ', '.join(str(t) for t in data['tags'])
        if 'category' in data and isinstance(data['category'], (list, tuple)):
            data['category'] = ', '.join(str(c) for c in data['category'])
        # Replace Bengali Taka sign ৳ with BDT to prevent MySQL (1366, "Incorrect string value") on latin1 tables
        for key, val in list(data.items()):
            if isinstance(val, str) and '\u09F3' in val:
                data[key] = val.replace('\u09F3', 'BDT ').strip()
        return super().to_internal_value(data)


    class Meta:
        model = Consignment
        fields = '__all__'

