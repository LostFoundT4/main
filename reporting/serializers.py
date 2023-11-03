from asyncore import read
from rest_framework import serializers
from .models import ReportInfo, Status, Location, PendingUsers
from base_functions.models import UserAdditionalProfile
from base_functions.serializers import TicketSerializer, ItemSerializer, CurrentUserSerializer, CurrentUserProfileSerializer
from django.contrib.auth.models import User

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class PendingUsersSerializer(serializers.ModelSerializer):
    # user = CurrentUserSerializer()
    username = serializers.CharField(source="user.username")
    phoneNumber = serializers.SerializerMethodField('phone_number')

    class Meta:
        model = PendingUsers
        fields = ['id', 'user', 'username', 'status', 'securityAnswer', 'phoneNumber']
    
    def phone_number(self,obj):
        userDetails = UserAdditionalProfile.objects.get(user=obj.user_id)
        return userDetails.userPhoneNumber
        
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