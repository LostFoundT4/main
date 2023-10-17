from __future__ import absolute_import, unicode_literals

import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Application_Main.settings')

app = Celery('Application_Main')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.conf.beat_schedule = {
    'every-15-seconds': {
        'task': 'reporting.tasks.check_status_counter',
        # 'schedule': crontab(hour="*/72"),
        'schedule': 15
    }
}

app.autodiscover_tasks()