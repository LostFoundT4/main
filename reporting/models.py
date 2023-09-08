from django.db import models
from base_functions.models import Ticket, Item
from django.contrib.auth.models import User

# Create your models here.
class ReportInfo(models.Model):
    reportInfoID = models.AutoField(primary_key=True)
    ticketID = models.ForeignKey(Ticket, related_name='ticket', verbose_name="ticketID", on_delete=models.SET_DEFAULT, default=None)
    itemID = models.ForeignKey(Item, related_name='item', verbose_name="itemID", on_delete=models.SET_DEFAULT, default=None)
    locationID = models.ForeignKey(to='Location', verbose_name="locationID", on_delete=models.SET_DEFAULT, default=None)
    description = models.CharField(max_length=300)

class Status(models.Model):
    statusID = models.AutoField(primary_key=True)
    userID = models.ForeignKey(User, related_name='user', verbose_name="id", on_delete=models.SET_DEFAULT, default=None)
    ticketID = models.ForeignKey(Ticket, related_name='tickets', verbose_name="ticketID", on_delete=models.SET_DEFAULT, default=None)
    type = models.CharField(max_length=200)
    endorsedUserID = models.IntegerField(blank=True, null=True)

class Location (models.Model):
    locationID = models.AutoField(primary_key=True)
    building = models.CharField(max_length=200)
    room = models.CharField(max_length=200)
