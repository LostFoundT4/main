from django.shortcuts import redirect
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
# from rest_framework.renderers import JSONRenderer
from knox.settings import CONSTANTS
from knox.auth import TokenAuthentication

# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
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
            #return Response({
            #    "user": UserSerializer(user, context=self.get_serializer_context()).data,
            #    "token": token
            #})
            return Response(serializer.data, status=status.HTTP_200_OK)
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