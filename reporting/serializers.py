from rest_framework import serializers
from .models import ReportInfo, Status, Location
from base_functions.serializers import TicketSerializer, ItemSerializer

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    ticket = TicketSerializer()
    location = LocationSerializer()
    item = ItemSerializer()

    class Meta:
        model = ReportInfo
        fields = ['reportInfoID', 'description', 'ticket', 'location', 'item']


class StatusSerializer(serializers.ModelSerializer):
    ticket = TicketSerializer()

    class Meta:
        model = Status
        fields = ['statusID','user_id', 'ticket', 'type', 'endorsedUserID']


class AlterReportSerializer(serializers.ModelSerializer):

    class Meta:
        model = ReportInfo
        fields = "__all__"

class AlterStatusSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Status
        fields = "__all__"