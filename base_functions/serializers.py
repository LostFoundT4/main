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


class UserAdditionalDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAdditionalProfile
        fields = ['user', 'userVerifiedStatus']  # Include other fields as needed

    def validate_user_id(self, user_id):
        # Query to check if the email verification field is true or false for a given user ID
        try:
            user_additional_data = UserAdditionalProfile.objects.get(user__id=user_id)
            print(user_additional_data.userVerifiedStatus)
            return user_additional_data.userVerifiedStatus
        except UserAdditionalProfile.DoesNotExist:
            raise serializers.ValidationError("User ID doesn't exist")

class UpdateEmailVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAdditionalProfile
        fields = ['userVerifiedStatus']  # Only include the field that should be updated

    def update(self, instance, validated_data):
        instance.emailVerificationField = validated_data.get('userVerifiedStatus', instance.userVerifiedStatus)
        instance.save()
        return instance