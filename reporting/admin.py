# registering models with the admin site to enable administrators / users with the appropriate permissions to perform CRUD operations

from django.contrib import admin
from .models import ReportInfo, Status, Location, PendingUsers


# Register your models here.
admin.site.register(ReportInfo)
admin.site.register(Status)
admin.site.register(Location)
admin.site.register(PendingUsers)
