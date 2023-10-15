from pickle import FALSE
from django.http import HttpResponse
from django.http import JsonResponse
from .models import ReportInfo, Status, Location, PendingUsers
from base_functions.models import Ticket, Item, Reputation, Blacklist
from base_functions.serializers import ReputationSerializer
from django.contrib.auth.models import User
from .serializers import LocationSerializer, ReportSerializer, StatusSerializer , AlterReportSerializer , AlterStatusSerializer, PendingUsersSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone


# CRUD for Location
@api_view(['GET', 'POST'])
def location_list(request):

    if request.method == 'GET':
        locations = Location.objects.all()
        serializer = LocationSerializer(locations, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = LocationSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
def location_detail(request, id, format=None):

    try:
        location = Location.objects.get(pk=id)
    except Location.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = LocationSerializer(location)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = LocationSerializer(location, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        location.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# CRUD for ReportInfo
@api_view(['GET', 'POST'])
def reportInfo_list(request):

    if request.method == 'GET':
        reportInfos = ReportInfo.objects.all()
        serializer = ReportSerializer(reportInfos, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = AlterReportSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
def reportInfo_detail(request, id, format=None):

    try:
        reportInfo = ReportInfo.objects.get(pk=id)
    except ReportInfo.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ReportSerializer(reportInfo)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = AlterReportSerializer(reportInfo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        reportInfo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# CRUD for Status
@api_view(['GET', 'POST'])
def status_list(request):

    if request.method == 'GET':
        statusObj = Status.objects.all()
        serializer = StatusSerializer(statusObj, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = AlterStatusSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
def status_detail(request, id, format=None):

    try:
        statusObj = Status.objects.get(pk=id)
    except Status.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = StatusSerializer(statusObj)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = AlterStatusSerializer(statusObj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        statusObj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# CRUD for PendingUsers
@api_view(['GET', 'POST'])
def pendingUsers_list(request):

    if request.method == 'GET':
        pendingUsers = PendingUsers.objects.all()
        serializer = PendingUsersSerializer(pendingUsers, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = PendingUsersSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
def pendingUsers_detail(request, id, format=None):

    try:
        pendingUsers = PendingUsers.objects.get(pk=id)
    except PendingUsers.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PendingUsersSerializer(pendingUsers)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = PendingUsersSerializer(pendingUsers, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        pendingUsers.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def claim_foundItem(request, id, format=None):

    try:
        ticket = Ticket.objects.get(pk=id)
    except Ticket.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        userID = ticket.user_id
        user = User.objects.get(pk=userID)
        reputationObj = Reputation.objects.get(user=userID)
        reputation = ReputationSerializer(reputationObj)
        flagStatus = reputation.data["flagged"]
        statusObj = Status.objects.get(ticket=ticket.ticketID)
        statusType = statusObj.status
        endorsedUserID = statusObj.endorsedUserID

        # Check if the user is blacklisted for the particular ticket
        blacklist = False
        try :
            blacklistObj = Blacklist.objects.get(ticket=ticket.ticketID,user=userID)
            blacklist = True
        except Blacklist.DoesNotExist:
            blacklist = False


        # Check if user's flag status is ok, then proceed with adding the user to the claim list
        if flagStatus < 3 and statusType != "Claimed" and endorsedUserID != "null" and blacklist == False:
            # pendingUser = PendingUsers.objects.create(user=user, status=statusObj)

            # Change the status to "Pending"
            statusObj.status = "Pending"

            # Add counter and start the countdown timer
            statusObj.counter += 1
            statusObj.save()

            # Calculate the new time (current time + 72 hours)
            new_time = timezone.now() + timezone.timedelta(hours=72)
            statusObj.timer = new_time
            
            statusData = StatusSerializer(statusObj)
            return Response(statusData.data)

            # Run trend analysis in the backend 

        else:
            return Response(status.HTTP_404_NOT_FOUND)
    else:
        return Response(status.HTTP_404_NOT_FOUND)
