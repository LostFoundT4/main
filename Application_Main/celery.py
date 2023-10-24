import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Application_Main.settings")
app = Celery("Application_Main")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()