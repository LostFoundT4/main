from asyncore import read
from rest_framework import serializers
from .models import ReportInfo, Status, Location, PendingUsers
from base_functions.models import UserAdditionalProfile, Reputation
from base_functions.serializers import TicketSerializer, ItemSerializer
from django.contrib.auth.models import User

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class PendingUsersSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    phoneNumber = serializers.SerializerMethodField('phone_number')
    score = serializers.SerializerMethodField('reputation_score')

    class Meta:
        model = PendingUsers
        fields = ['id', 'user', 'username', 'status', 'securityAnswer', 'phoneNumber', 'score']
    
    def phone_number(self,obj):
        userDetails = UserAdditionalProfile.objects.get(user=obj.user_id)
        return userDetails.userPhoneNumber
    
    def reputation_score(self,obj):
        reputation = Reputation.objects.get(user=obj.user_id)
        return reputation.score
        
class StatusSerializer(serializers.ModelSerializer):
    ticket = TicketSerializer()
    pendingUsers = PendingUsersSerializer(read_only=True, many=True)
    endorsedUsername = serializers.SerializerMethodField('endorseUser_ID')

    class Meta:
        model = Status
        fields = ['statusID', 'ticket', 'pendingUsers', 'status', 'endorsedUserID', 'counter', 'previous_counter', 'endorsedUsername']

    def endorseUser_ID(self,obj):
        if obj.endorsedUserID != None:
            userDetails = User.objects.get(pk=obj.endorsedUserID)
            return userDetails.username
        else:
            return None
    
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