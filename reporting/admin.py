from django.contrib import admin
from .models import ReportInfo, Status, Location, PendingUsers


# Register your models here.
admin.site.register(ReportInfo)
admin.site.register(Status)
admin.site.register(Location)
admin.site.register(PendingUsers)
