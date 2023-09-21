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
    ticketID = models.ForeignKey(Ticket, related_name='items', verbose_name="ticketID", on_delete=models.SET_DEFAULT, default=None)
    itemName = models.CharField(max_length=200)
    category = models.CharField(max_length=200)
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    found_dateTime = models.DateTimeField(default=timezone.now)