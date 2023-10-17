from sqlite3 import Timestamp
from statistics import mode
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Create your models here.
class Ticket (models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ticketID = models.AutoField(primary_key=True)
    ticketType = models.CharField(max_length=100)
    created_dateTime = models.DateTimeField(auto_now_add=True)

class Item (models.Model):
    itemID = models.AutoField(primary_key=True)
    ticketID = models.ForeignKey(Ticket, related_name='items', verbose_name="ticketID", on_delete=models.CASCADE, default=None)
    itemName = models.CharField(max_length=200)
    category = models.CharField(max_length=200)
    image = models.ImageField(upload_to='images/', blank=True, null=True, default='images/default')
    found_dateTime = models.DateTimeField(default=timezone.now)

class UserAdditionalProfile(models.Model):
    userProfileNumber = models.AutoField(primary_key = True)
    user = models.ForeignKey(User, related_name='profile', on_delete=models.CASCADE, default=None)
    userTelegramID = models.CharField(max_length=100, blank=True, null=True)
    userProfilePicture = models.ImageField(upload_to='profile-images/', blank=True, null=True, default='profile-images/default')
    userPhoneNumber = models.CharField(max_length=8, blank=True)

class Reputation(models.Model):
    reputationID = models.AutoField(primary_key = True)
    user = models.ForeignKey(User, related_name='reputation', on_delete=models.CASCADE, default=None)
    flagged = models.IntegerField(blank=True, null=True)
    score = models.IntegerField(blank=True, null=True)

class Blacklist(models.Model):
    blacklistID = models.AutoField(primary_key= True)
    user = models.ForeignKey(User, related_name='blacklist', on_delete=models.CASCADE, default=None)    
    ticket = models.ForeignKey(Ticket, related_name='blacklist', on_delete=models.CASCADE, default=None)
    timestamp = models.DateTimeField(auto_now_add=True)