from django.urls import path
from .views import TrackConsignmentView, ConsignmentListCreateView, AddMilestoneView

urlpatterns = [
    path('track/<str:consignment_no>/', TrackConsignmentView.as_view(), name='track-consignment'),
    path('consignments/', ConsignmentListCreateView.as_view(), name='consignment-list-create'),
    path('track/<str:consignment_no>/add-milestone/', AddMilestoneView.as_view(), name='add-milestone'),
]
