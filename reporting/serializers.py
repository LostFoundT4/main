from asyncore import read
from rest_framework import serializers
from .models import ReportInfo, Status, Location, PendingUsers
from base_functions.serializers import TicketSerializer, ItemSerializer, CurrentUserSerializer
from django.contrib.auth.models import User

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class PendingUsersSerializer(serializers.ModelSerializer):
    # user = CurrentUserSerializer()
    username = serializers.CharField(source="user.username")
    
    class Meta:
        model = PendingUsers
        fields = ['id', 'user', 'username', 'status']
        
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
        fields = ['reportInfoID', 'description', 'ticket', 'location', 'item', 'status', 'securityQuestion']

class AlterReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportInfo
        fields = "__all__"

class AlterStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = "__all__"

class AlterPendingUsersSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PendingUsers
        fields = "__all__"