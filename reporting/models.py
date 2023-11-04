from django.db import models
from base_functions.models import Ticket, Item
from django.contrib.auth.models import User

class Status(models.Model):
    statusID = models.AutoField(primary_key=True)
    ticket = models.ForeignKey(Ticket,on_delete=models.CASCADE)
    status = models.CharField(max_length=200)
    endorsedUserID = models.IntegerField(blank=True, null=True)
    counter = models.IntegerField(blank=True, null=True)
    previous_counter = models.IntegerField(default=0)

class ReportInfo(models.Model):
    reportInfoID = models.AutoField(primary_key=True)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    location = models.ForeignKey(to='Location', on_delete=models.CASCADE)
    description = models.CharField(max_length=300)
    status = models.ForeignKey(Status, on_delete=models.CASCADE )
    securityQuestion = models.CharField(max_length=300, blank=True, null=True)

class Location (models.Model):
    locationID = models.AutoField(primary_key=True)
    building = models.CharField(max_length=200)
    room = models.CharField(max_length=200)

class PendingUsers(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.ForeignKey(Status,related_name="pendingUsers", on_delete=models.CASCADE)
    securityAnswer = models.CharField(max_length=300, blank=True, null=True)

