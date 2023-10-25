from dataclasses import fields
from pyexpat import model
from rest_framework import serializers
from .models import Ticket, Item, UserAdditionalProfile, Reputation, Blacklist
from django.contrib.auth.models import User


class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class ReputationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reputation
        fields = '__all__'
        
class BlacklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blacklist
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    # items = ItemSerializer(many=True)
    user = CurrentUserSerializer
    username = serializers.CharField(source="user.username")

    class Meta:
        model = Ticket
        fields = ['ticketID', 'ticketType', 'created_dateTime', 'user', 'username', 'isValuable']

class AlterTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'

class CurrentUserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")

    class Meta:
        model = UserAdditionalProfile
        fields = ['userProfileNumber', 'userTelegramID', 'userProfilePicture', 'userPhoneNumber', 'user', 'username']

class AlterCurrentUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAdditionalProfile
        fields = '__all__'