from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from base_functions.models import Ticket, Item, Reputation, Blacklist
from reporting.models import Status, Location


def create_mock_user(username, password, email):
    return User.objects.create_user(username=username, password=password, email=email)

def create_mock_reputation(user, flagged, score):
    return Reputation.objects.create(user=user, flagged=flagged, score=score)

def create_mock_ticket(user, type, isValuable):
    return Ticket.objects.create(user=user, ticketType=type, isValuable=isValuable)

def create_mock_item(ticket, name, category):
    return Item.objects.create(ticketID=ticket, itemName=name, category=category)

def create_mock_status(ticket, status, counter):
    return Status.objects.create(ticket=ticket, status=status, counter=counter)

def create_mock_location(building, room):
    return Location.objects.create(building=building, room=room)

def  create_mock_blacklist(user):
    return Blacklist.objects.create(user=user)


class APITestCase(TestCase):
    def setUp(self):
        # Create mock objects
        self.client = APIClient()
        self.user = create_mock_user("user", "password", "user@email.com")
        self.ticket = create_mock_ticket(self.user, "Lost", True)
        self.item = create_mock_item(self.ticket, "Hydroflask", "Water bottle")
        self.status = create_mock_status(self.ticket, "Unclaimed", 0)
        self.location = create_mock_location("SCIS", "2-12")

    def test_createTicket_success(self):
        data = {
            "user": self.user.id, 
            "ticketType": "Lost",
            "isValuable": True
        }

        response = self.client.post('/tickets/', data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["ticketType"], "Lost")

    def test_createTicket_fail(self):
        data = {
            "user": self.user.id, 
            "ticketType": "",
            "isValuable": False
        }
        with self.assertRaises(AssertionError):
            response = self.client.post('/tickets/', data, format='json')

    def test_createItem_success(self):
        data = {
            "ticketID": self.ticket.ticketID, 
            "itemName": "Hydroflask",
            "category": "Water bottle"
        }
        response = self.client.post('/items/', data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["itemName"], "Hydroflask")

    def test_createItem_fail(self):
        data = {
            "ticketID": self.ticket.ticketID, 
            "itemName": "",
            "category": True
        }
        
        with self.assertRaises(AssertionError):
            response = self.client.post('/items/', data, format='json')        

    def test_createStatus_success(self):
        data = {
            "ticket": self.ticket.ticketID,
            "status": "Unclaimed",
            "endorsedUserID": 0, 
            "counter": 0,
            "previous_counter": 0
        }
        response = self.client.post('/status/', data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], "Unclaimed")

    def test_createStatus_fail(self):
        data = {
            "ticket": self.ticket.ticketID,
            "status": "",
            "endorsedUserID": "", 
            "counter": "",
            "previous_counter": True
        }

        with self.assertRaises(AssertionError):
            response = self.client.post('/status/', data, format='json')     

    def test_createReportInfos_success(self):
        data = {
            "ticket": self.ticket.ticketID,
            "item": self.item.itemID,
            "location": self.location.locationID,
            "description": "Got stickers",
            "status": self.status.statusID,
            "securityQuestion": "What is the stickers on bottom right?"
        }
        response = self.client.post('/reportInfos/', data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["description"], "Got stickers")

    def test_createReportInfos_fail(self):
        data = {
            "ticket": "",
            "item": "",
            "location": "",
            "description": True,
            "status": "",
            "securityQuestion": False
        }

        with self.assertRaises(AssertionError):
            response = self.client.post('/reportInfos/', data, format='json')

    def test_createLocation_success(self):
        data = {
            "building": "SCIS 1", 
            "room": "2-12",
        }

        response = self.client.post('/locations/', data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["building"], "SCIS 1")

    def test_createLocation_fail(self):
        data = {
            "building": "", 
            "room": True,
        }

        with self.assertRaises(AssertionError):
            response = self.client.post('/locations/', data, format='json')

    def test_createUserProfile_success(self):
        data = {
            "user": self.user.id, 
            "userTelegramID": "JohnWick",
            "userPhoneNumber": "12345678",
        }

        response = self.client.post('/userProfiles/', data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["userTelegramID"], "JohnWick")

    def test_createUserProfile_fail(self):
        data = {
            "user": "", 
            "userTelegramID": "",
            "userPhoneNumber": True,
        }
        
        with self.assertRaises(AssertionError):
            response = self.client.post('/userProfiles/', data, format='json')

    def test_createReputation_success(self):
        data = {
            "user": self.user.id, 
            "flagged": 0,
            "score": 5,
        }

        response = self.client.post('/reputation/', data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["score"], 5)

    def test_createReputation_fail(self):
        data = {
            "user": self.user.id, 
            "flagged": True,
            "score": "",
        }

        with self.assertRaises(AssertionError):
            response = self.client.post('/reputation/', data, format='json')

    def test_createBlacklist_success(self):
        data = {
            "user": self.user.id,
        }

        response = self.client.post('/blacklist/', data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["user"], self.user.id)

    def test_createBlacklist_fail(self):
        data = {
            "user": "2",
        }

        with self.assertRaises(AssertionError):
            response = self.client.post('/blacklist/', data, format='json')

    def test_createPendingUser_success(self):
        data = {
            "user": self.user.id,
            "status": self.status.statusID,
            "securityAnswer": "It is black and pink"
        }

        response = self.client.post('/pendingUsers/', data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["securityAnswer"], "It is black and pink")

    def test_createPendingUser_fail(self):
        data = {
            "user": self.user.id,
            "status": True,
            "securityAnswer": ""
        }

        with self.assertRaises(AssertionError):
            response = self.client.post('/pendingUsers/', data, format='json')

class FoundTicketTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.owner = create_mock_user("owner", "password", "user@email.com")
        self.reputation = create_mock_reputation(self.owner, 0, 5)
        self.ticket = create_mock_ticket(self.owner, "Found", True)
        self.item = create_mock_item(self.ticket, "Hydroflask", "Water bottle")
        self.status = create_mock_status(self.ticket, "Unclaimed", 0)
        self.location = create_mock_location("SCIS", "2-10")

    # User with good reputation score able to send claim request successfully
    def test_goodReputationUser_claimTicket_sucess(self):
        self.user = create_mock_user("user", "password", "user@email.com")
        self.reputation = create_mock_reputation(self.user, 0, 5)
        data = {
            "userID": self.user.id, 
            "securityAnswer": "The colour is black"
        }

        response = self.client.put('/claimTicket/' + str(self.ticket.ticketID), data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "Pending")
        self.assertEqual(response.data["counter"], 1)
    
    # User with bad reputation score able to send claim request successfully
    def test_badReputationUser_claimTicket_fail(self):
        self.user = create_mock_user("user", "password", "user@email.com")
        self.reputation = create_mock_reputation(self.user, 0, 2)
        data = {
            "userID": self.user.id, 
            "securityAnswer": "The colour is black"
        }

        response = self.client.put('/claimTicket/' + str(self.ticket.ticketID), data, format='json')
        self.assertEqual(response.data, 404)
        self.assertEqual(self.status.status, "Unclaimed")

    # User that claims too many tickets at the same time will get an error
    def test_userClaimManyTicket_AtSameTime_fail(self):
        self.ticket2 = create_mock_ticket(self.owner, "Found", True)
        self.status2 = create_mock_status(self.ticket2, "Unclaimed", 0)

        self.ticket3 = create_mock_ticket(self.owner, "Found", True)
        self.status3 = create_mock_status(self.ticket3, "Unclaimed", 0)

        self.ticket4 = create_mock_ticket(self.owner, "Found", True)
        self.status4 = create_mock_status(self.ticket4, "Unclaimed", 0)

        self.ticket5 = create_mock_ticket(self.owner, "Found", True)
        self.status5 = create_mock_status(self.ticket5, "Unclaimed", 0)

        self.user = create_mock_user("user", "password", "user@email.com")
        self.reputation = create_mock_reputation(self.user, 0, 5)
        data = {
            "userID": self.user.id, 
            "securityAnswer": "The colour is black"
        }

        response = self.client.put('/claimTicket/' + str(self.ticket.ticketID), data, format='json')
        response2 = self.client.put('/claimTicket/' + str(self.ticket2.ticketID), data, format='json')
        response3 = self.client.put('/claimTicket/' + str(self.ticket3.ticketID), data, format='json')
        response4 = self.client.put('/claimTicket/' + str(self.ticket4.ticketID), data, format='json')
        response5 = self.client.put('/claimTicket/' + str(self.ticket5.ticketID), data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response3.status_code, 200)
        self.assertEqual(response4.status_code, 200)
        # User will not be allowed to send claim requests if he claims more than 4 tickets at the same time
        self.assertEqual(response5.data, 404)

    # User tried to claim the same ticket twice will get an error
    def test_userClaimSameTicket_fail(self):
        self.user = create_mock_user("user", "password", "user@email.com")
        self.reputation = create_mock_reputation(self.user, 0, 5)

        data = {
            "userID": self.user.id, 
            "securityAnswer": "The colour is black"
        }

        response = self.client.put('/claimTicket/' + str(self.ticket.ticketID), data, format='json')
        self.assertEqual(response.status_code, 200)
        # Second attempt to claim the same ticket will fail
        response2 = self.client.put('/claimTicket/' + str(self.ticket.ticketID), data, format='json')
        self.assertEqual(response2.data, 404)

    # User that is blacklisted try to claim ticket will get an erro
    def test_blaclistedUser_claimTicket_fail(self):
        self.user = create_mock_user("user", "password", "user@email.com")
        self.reputation = create_mock_reputation(self.user, 0, 5)
        create_mock_blacklist(self.user)

        data = {
            "userID": self.user.id, 
            "securityAnswer": "The colour is black"
        }

        response = self.client.put('/claimTicket/' + str(self.ticket.ticketID), data, format='json')
        self.assertEqual(response.data, 404)
        
    # Ticket creator endorse the ticket to indicate the item is returned to the owner of the item
    def test_endorseTicket_sucess(self):
        # User claim the item is his and send claim request with the security answer
        self.user = create_mock_user("user", "password", "user@email.com")
        self.reputation = create_mock_reputation(self.user, 0, 5)
        data = {
            "userID": self.user.id, 
            "securityAnswer": "The colour is black"
        }

        self.client.put('/claimTicket/' + str(self.ticket.ticketID), data, format='json')

        # Ticket creator verified the item is belong to the user and endorse the ticket
        data = {
            "endorsedUserID": self.user.id
        }

        response = self.client.put('/endorseTicket/' + str(self.ticket.ticketID), data, format='json')
        self.assertEqual(response.data["endorsedUserID"], self.user.id)
        self.assertEqual(response.data["status"], "Claimed")
