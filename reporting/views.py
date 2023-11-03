from datetime import datetime
from pickle import FALSE
from django.http import HttpResponse
from django.http import JsonResponse
from .models import ReportInfo, Status, Location, PendingUsers
from base_functions.models import Ticket, Item, Reputation, Blacklist
from base_functions.serializers import ReputationSerializer
from django.contrib.auth.models import User
from .serializers import LocationSerializer, ReportSerializer, StatusSerializer, AlterReportSerializer, AlterStatusSerializer, PendingUsersSerializer, AlterPendingUsersSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from difflib import SequenceMatcher

# CRUD for Location
@api_view(['GET', 'POST'])
def location_list(request):

    if request.method == 'GET':
        locations = Location.objects.all()
        serializer = LocationSerializer(locations, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = LocationSerializer(data=request.data)
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
        serializer = AlterReportSerializer(data=request.data)
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
        serializer = AlterStatusSerializer(data=request.data)
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
        serializer = AlterPendingUsersSerializer(data=request.data)
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
        serializer = AlterPendingUsersSerializer(
            pendingUsers, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        pendingUsers.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
def close_ticket(request, id, format=None):
    try:
        statusObj = Status.objects.get(pk=id)
    except Status.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        statusObj.status = "Found"
        statusObj.save()
        return Response(status.HTTP_200_OK)

    return Response(status.HTTP_400_BAD_REQUEST)

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

@api_view(['PUT'])
def claim_foundItem(request, id, format=None):
    userID = request.data['userID']
    givenAnswer = request.data['securityAnswer']

    try:
        ticket = Ticket.objects.get(pk=id)
    except Ticket.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        user = User.objects.get(pk=userID)

        reputationObj = Reputation.objects.get(user=userID)
        flagStatus = reputationObj.flagged
        reputationScore = reputationObj.score

        statusObj = Status.objects.get(ticket=ticket.ticketID)
        statusType = statusObj.status
        statusID = statusObj.statusID
        endorsedUserID = statusObj.endorsedUserID

        # Check if the item is belong to the user
        isBelongsToUser = False
        ownerID = ticket.user_id
        if ownerID == int(userID):
            isBelongsToUser = True

        # Check if the user is blacklisted
        isBlacklisted = False
        try:
            blacklistObj = Blacklist.objects.get(user=userID)
            isBlacklisted = True
        except Blacklist.DoesNotExist:
            isBlacklisted = False

        # Check if the user is in the pending list already (no double-claim)
        isPending = False
        try:
            pendingObj = PendingUsers.objects.get(user=userID, status=statusID)
            isPending = True
        except PendingUsers.DoesNotExist:
            isPending = False

        if isBelongsToUser == True or isBlacklisted == True or isPending == True:
            return Response(status.HTTP_404_NOT_FOUND)

        # Check if user's reputation, then proceed with adding the user to the claim list
        if flagStatus < 4 and reputationScore >= 3 and statusType != "Claimed" and endorsedUserID != "null":

            # User will be flagged
            pendingUser = PendingUsers.objects.create(
                user=user, status=statusObj, securityAnswer=givenAnswer)
            reputationObj.flagged += 1
            reputationObj.save()

            # Change the ticket status to "Pending"
            statusObj.status = "Pending"

            # Add counter
            statusObj.counter += 1
            statusObj.save()

            # Check if the user claim multiple items (more than 3) at the same time

            statusData = StatusSerializer(statusObj)
            return Response(statusData.data)

        else:
            # Blacklist the users and remove his pending items
            Blacklist.objects.create(user=user, timestamp=datetime.now())
            falseClaimList = PendingUsers.objects.filter(user=user)
            
            # Change the status of the pending items back to unclaimed if no other pending users and reduce the counter
            for claimer in falseClaimList:
                statusID = claimer.status_id
                statusObj = Status.objects.get(pk=statusID)
                statusObj.counter -= 1
                statusObj.save()

                if statusObj.counter == 0:
                    statusObj.status = "Unclaimed"
                statusObj.save()


            falseClaimList.delete()
            
            return Response(status.HTTP_404_NOT_FOUND)

    else:
        return Response(status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
def endorsed_foundItem(request, id, format=None):
    endorsedUserID = request.data['endorsedUserID']

    try:
        ticket = Ticket.objects.get(pk=id)
    except Ticket.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        statusObj = Status.objects.get(ticket=ticket.ticketID)
        statusID = statusObj.statusID

        isClaimed = False
        if statusObj.status == "Claimed":
            isClaimed = True

        # Check if the item is belong to the himself
        isBelongsToUser = False
        ownerID = ticket.user_id
        if ownerID == int(endorsedUserID):
            isBelongsToUser = True

        # Check if the user is in the pending list
        isInPendingList = False
        try:
            pendingUserList = PendingUsers.objects.get(
                status=statusID, user=endorsedUserID)
            isInPendingList = True
        except PendingUsers.DoesNotExist:
            isInPendingList = False

        if isClaimed == True or isBelongsToUser == True or isInPendingList == False:
            return Response(status.HTTP_404_NOT_FOUND)

        # The owner of the found item will be de-flagged, increase reputation score
        reputationObj = Reputation.objects.get(user=endorsedUserID)
        flagStatus = reputationObj.flagged
        reputationScore = reputationObj.score

        if (flagStatus > 0):
            reputationObj.flagged -= 1
        if (reputationScore > 0 and reputationScore < 5):
            reputationObj.score += 0.5
        reputationObj.save()

        # Change the status to "Claimed" and endorse the ticket to the owner
        statusObj.status = "Claimed"
        statusObj.endorsedUserID = endorsedUserID
        statusObj.save()

        # False-claimer's reputation score will descrease 0.5
        falseClaimerList = PendingUsers.objects.filter(
            status=statusID).exclude(user=endorsedUserID)

        for falseClaimer in falseClaimerList:
            user = Reputation.objects.get(user=falseClaimer.user)
            userID = user.user_id
            user.score -= 0.5
            user.save()

            # Blacklist the user if their score is less than 3 which means they false claim item more than 4 times
            if user.score < 3.0:
                userObj = User.objects.get(pk=userID)
                Blacklist.objects.create(
                    user=userObj, timestamp=datetime.now())

        # Delete the pending user list since the item is claimed
        pendingUserList = PendingUsers.objects.filter(status=statusID)
        pendingUserList.delete()

        statusData = StatusSerializer(statusObj)
        return Response(statusData.data)

    else:
        return Response(status.HTTP_404_NOT_FOUND)
