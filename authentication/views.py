from django.contrib.auth import login
from django.http import HttpResponse
from django.shortcuts import render
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.models import User
from django.utils.encoding import force_bytes, force_str

from authentication.tokens import account_activation_token

# Create your views here.
def activate(request, uidb64, token):
    
    component_content = """
    <div>
        <h1>Hello, World!</h1>
        <p>This is a simple HTML component.</p>
    </div>
    """
    
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        login(request, user)
        #return HttpResponse('Thank you for your email confirmation. Now you can login your account.')
        return HttpResponse(component_content)
    else:
        return HttpResponse('Activation link is invalid!')
