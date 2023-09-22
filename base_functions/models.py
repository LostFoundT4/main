from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Create your models here.
class Ticket (models.Model):
    userID = models.ForeignKey(User, related_name='tickets',on_delete=models.SET_DEFAULT, default=None)
    ticketID = models.AutoField(primary_key=True)
    ticketType = models.CharField(max_length=100)
    created_dateTime = models.DateTimeField(auto_now_add=True)

class Item (models.Model):
    itemID = models.AutoField(primary_key=True)
    ticketID = models.ForeignKey(Ticket, related_name='items', verbose_name="ticketID", on_delete=models.SET_DEFAULT, default=None)
    itemName = models.CharField(max_length=200)
    category = models.CharField(max_length=200)
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    found_dateTime = models.DateTimeField(default=timezone.now)

class userAdditionalProfile(models.Model):
    userProfileNumber = models.AutoField(primary_key = True)
    usedID = models.ForeignKey(User, related_name='profile', on_delete=models.SET_DEFAULT, default=None)
    userTelegramID = models.CharField(max_length=100, blank=True, null=True)
    userProfilePicture = models.ImageField(upload_to='profile-images/', blank=True, null=True)
    userPhoneNumber = models.CharField(max_length=8, blank=True)