from rest_framework import serializers
from .models import Ticket, Item
from django.contrib.auth.models import User


class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    # items = ItemSerializer(many=True)
    user = CurrentUserSerializer
    username = serializers.CharField(source="user.username")

    class Meta:
        model = Ticket
        fields = ['ticketID', 'ticketType', 'created_dateTime', 'user', 'username']