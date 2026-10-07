from rest_framework import generics, permissions
from .models import UserProfile
from .serializers import UserProfileSerializer

class CurrentUserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile
