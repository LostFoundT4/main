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
    <head>
        <style>
            /* Center the message both horizontally and vertically */
            .email-confirmation {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                font-family: "Lexend Deca", "Montserrat", sans-serif;
                color: #000; /* Font color is black */
            }

            h1 {
                font-size: 24px;
            }

            p {
                font-size: 16px;
                color: #000; /* Font color is black */
            }
        </style>
    </head>
    <body>
        <div class="email-confirmation">
            <h1>Thank you for your email confirmation</h1>
            <p>Now you can login to your account.</p>
        </div>
    </body>
    """
    
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        login(request, user)
        #return HttpResponse('Thank you for your email confirmation. Now you can login your account.')
        return HttpResponse(component_content, content_type="text/html")
    else:
        return HttpResponse('Activation link is invalid!')
