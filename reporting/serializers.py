from asyncore import read
from rest_framework import serializers
from .models import ReportInfo, Status, Location, PendingUsers
from base_functions.serializers import TicketSerializer, ItemSerializer, CurrentUserSerializer

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class PendingUsersSerializer(serializers.ModelSerializer):
    # user = CurrentUserSerializer()
    
    class Meta:
        model = PendingUsers
        fields = "__all__"
        
class StatusSerializer(serializers.ModelSerializer):
    ticket = TicketSerializer()
    pendingUsers = PendingUsersSerializer(read_only=True, many=True)

    class Meta:
        model = Status
        fields = "__all__"

class ReportSerializer(serializers.ModelSerializer):
    ticket = TicketSerializer()
    location = LocationSerializer()
    item = ItemSerializer()
    status = StatusSerializer()

    class Meta:
        model = ReportInfo
        fields = ['reportInfoID', 'description', 'ticket', 'location', 'item', 'status']

class AlterReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportInfo
        fields = "__all__"

class AlterStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = "__all__"
