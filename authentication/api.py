from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import PasswordResetSerializer, UserSerializer, RegisterSerializer, LoginSerializer, UserProfileUpdaterSerializer
# from rest_framework.renderers import JSONRenderer
from knox.settings import CONSTANTS
from knox.auth import TokenAuthentication

from .tokens import account_activation_token
from django.core.mail import EmailMessage


# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        print("Inside")
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        mail_subject = 'Verify your Lost And Found account email.'
        message = render_to_string('acc_active_email.html', {
        'user': user,
        'domain': '127.0.0.1:8080',
        'uid':urlsafe_base64_encode(force_bytes(user.pk)),
        'token':account_activation_token.make_token(user),
        })
        user2 = UserSerializer(user, context=self.get_serializer_context()).data
        print(user2)
        to_email = user2.get("email")
        email = EmailMessage(
            mail_subject, message, to=[to_email]
        )
        email.send()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

# Login API
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data
            _, token = AuthToken.objects.create(user)
            print("Hello")
            return Response({
               "user": UserSerializer(user, context=self.get_serializer_context()).data,
               "token": token
            })
            # return Response(serializer.data , status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

# Get User API
class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_object(self):
        token = self.request.META.get('HTTP_AUTHORIZATION')
        objs = AuthToken.objects.filter(token_key=token[6:CONSTANTS.TOKEN_KEY_LENGTH+6])
        #print(self.xrequest.user.email)
        #print(self.request.user.is_authenticated)
        return self.request.user

class UpdateProfileView(generics.UpdateAPIView):

    queryset = User.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserProfileUpdaterSerializer

# PasswordReset API
class PasswordResetAPI(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        mail_subject = 'Reset your Lost And Found account password.'
        message = render_to_string('password_reset.html', {
        'user': user,
        'domain': '127.0.0.1:8080',
        'uid':urlsafe_base64_encode(force_bytes(user.pk)),
        'token':account_activation_token.make_token(user),
        })
        user2 = UserSerializer(user, context=self.get_serializer_context()).data
        print(user2)
        to_email = user2.get("email")
        email = EmailMessage(
            mail_subject, message, to=[to_email]
        )
        email.send()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })