from celery import shared_task
from datetime import timedelta
from django.utils import timezone
from .models import Status
from base_functions.models import Ticket
import time

@shared_task
def send_email(email):
    print(f'A sample message is sent to {email}')


@shared_task
# Check for unusual claim request (if the ticket is claimed by many user at the same time)
def check_status_counter():
    statuses = Status.objects.filter()
    for status in statuses:
        if status.previous_counter is not None and status.counter - status.previous_counter >= 5:
                # Delete the ticket if too many claim requests were made
                ticket = Ticket.objects.get(pk=status.ticket.ticketID)
                ticket.delete()
                print(f'Delete ticket') 
                pass

        # Update previous_counter with the current counter value
        status.previous_counter = status.counter
        status.save()