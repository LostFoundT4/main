from django.http import HttpResponse
from django.http import JsonResponse
from .models import Ticket, Item, UserAdditionalProfile, Reputation, Blacklist
from .serializers import ReputationSerializer, TicketSerializer, ItemSerializer, AlterTicketSerializer, CurrentUserProfileSerializer, BlacklistSerializer, AlterCurrentUserProfileSerializer, UserAdditionalDataSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET', 'POST'])
def ticket_list(request):

    if request.method == 'GET':
        tickets = Ticket.objects.all()
        serializer = TicketSerializer(tickets, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = AlterTicketSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
def ticket_detail(request, id, format=None):

    try:
        ticket = Ticket.objects.get(pk=id)
        # items = ticket.item_set.all()
    except Ticket.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TicketSerializer(ticket)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = AlterTicketSerializer(ticket, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        # Delete all the items that has the same Ticket ID
        Item.objects.filter(ticketID = id).delete()
        ticket.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def item_list(request):

    if request.method == 'GET':
        items = Item.objects.all()
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = ItemSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
def item_detail(request, id, format=None):

    try:
        item = Item.objects.get(pk=id)
    except Item.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ItemSerializer(item)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ItemSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def userprofile_list(request):

    if request.method == 'GET':
        userProfile = UserAdditionalProfile.objects.all()
        serializer = CurrentUserProfileSerializer(userProfile, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = AlterCurrentUserProfileSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
def userprofile_detail(request, id, format=None):

    try:
        userProfile = UserAdditionalProfile.objects.get(pk=id)
    except UserAdditionalProfile.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CurrentUserProfileSerializer(userProfile)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = AlterCurrentUserProfileSerializer(userProfile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        userProfile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def userprofile_detail_withUserID(request, id, format=None):

    try:
        userProfile = UserAdditionalProfile.objects.get(user=id)
    except UserAdditionalProfile.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CurrentUserProfileSerializer(userProfile)
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_204_NO_CONTENT)
        

@api_view(['GET', 'POST'])
def reputation_list(request):

    if request.method == 'GET':
        reputation = Reputation.objects.all()
        serializer = ReputationSerializer(reputation, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = ReputationSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
def reputation_detail(request, id, format=None):

    try:
        reputation = Reputation.objects.get(pk=id)
    except Reputation.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ReputationSerializer(reputation)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ReputationSerializer(reputation, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        reputation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def reputation_detail_withUserID(request, id, format=None):

    try:
        reputation = Reputation.objects.get(user=id)
    except Reputation.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ReputationSerializer(reputation)
        return Response(serializer.data)
    else:
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def blacklist_list(request):

    if request.method == 'GET':
        blacklist = Blacklist.objects.all()
        serializer = BlacklistSerializer(blacklist, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = BlacklistSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
def blacklist_detail(request, id, format=None):

    try:
        blacklist = Blacklist.objects.get(pk=id)
    except Blacklist.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BlacklistSerializer(blacklist)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = BlacklistSerializer(blacklist, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        blacklist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def checkUserVerificationStatus(request, user_id):

    if request.method == "GET":
        serializer = UserAdditionalDataSerializer()
        is_verified = serializer.validate_user_id(user_id)
        return Response({'email_verified': is_verified}, status=status.HTTP_200_OK)

def index(request):
    print("Called")
    return HttpResponse("Hello, world. You're at the polls indexes:p")

def hello2(request):
    return HttpResponse("Testing Hello")
