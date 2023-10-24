from django.contrib import admin
from .models import Ticket, Item, UserAdditionalProfile, Reputation, Blacklist

# Register your models here.
admin.site.register(Ticket)
admin.site.register(Item)
admin.site.register(UserAdditionalProfile)
admin.site.register(Reputation)
admin.site.register(Blacklist)