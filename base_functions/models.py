from django.db import models
from django.utils import timezone

# Create your models here.
class Ticket (models.Model):
    ticketID = models.AutoField(primary_key=True)
    ticketType = models.CharField(max_length=100)
    created_dateTime = models.DateTimeField(auto_now_add=True)

class Item (models.Model):
    itemID = models.AutoField(primary_key=True)
    ticketID = models.ForeignKey(Ticket, related_name='items', verbose_name="ticketID", on_delete=models.SET_DEFAULT, default=None)
    itemName = models.CharField(max_length=200)
    category = models.CharField(max_length=200)
    imageURL = models.CharField(max_length=300, null=True, blank=True)
    found_dateTime = models.DateTimeField(default=timezone.now)