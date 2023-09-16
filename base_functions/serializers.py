from rest_framework import serializers
from .models import Ticket, Item

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True)

    class Meta:
        model = Ticket
        fields = ['ticketID', 'ticketType', 'created_dateTime', 'items']