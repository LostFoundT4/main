from django.contrib.auth import login
from django.http import HttpResponse
from django.shortcuts import render
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.models import User
from django.utils.encoding import force_bytes, force_str

from authentication.tokens import account_activation_token

# Create your views here.
def activate(request, uidb64, token):

    verify_success = """
<!DOCTYPE html>
<html>      
<head>
    <style>
        /* Set the background color for the entire page */
        body {
            background-color: #000; /* Background color is black */
        }

        /* Center the message both horizontally and vertically */
        .email-confirmation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            font-family: "Lexend Deca", "Montserrat", sans-serif;
            color: #6cf3c3; /* Font color is green */
        }

        h1 {
            font-size: 24px;
        }

        p {
            font-size: 16px;
            color: #6cf3c3; /* Font color is green */
        }

        /* Style the hyperlink */
        a {
            color: #6cf3c3; /* Font color is green for the link */
            text-decoration: underline; /* Underline the link text */
        }
    </style>
    <link href="https://fonts.googleapis.com/css?family=Lexend+Deca" rel="stylesheet">
</head>
<body>
    <div class="email-confirmation">
        <h1>Thank you for your email confirmation!</h1>
        <p>Now you can <a href="/frontend/sign-in">log in</a> to your account.</p>
    </div>
</body>
</html>
    """

    verify_failure = """
<!DOCTYPE html>
<html>      
<head>
    <style>
        /* Set the background color for the entire page */
        body {
            background-color: #000; /* Background color is black */
        }

        /* Center the message both horizontally and vertically */
        .email-confirmation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            font-family: "Lexend Deca", "Montserrat", sans-serif;
            color: #6cf3c3; /* Font color is green */
        }

        h1 {
            font-size: 24px;
        }

        p {
            font-size: 16px;
            color: #6cf3c3; /* Font color is green */
        }

        /* Style the hyperlink */
        a {
            color: #6cf3c3; /* Font color is green for the link */
            text-decoration: underline; /* Underline the link text */
        }
    </style>
    <link href="https://fonts.googleapis.com/css?family=Lexend+Deca" rel="stylesheet">
</head>
<body>
    <div class="email-confirmation">
        <h1>Sorry, your verification link has expired.</h1>
        <p>Please <a href="/frontend/sign-up">sign up</a> again.</p>
    </div>
</body>
</html>
    """
    
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        login(request, user)
        return HttpResponse(verify_success, content_type="text/html")
    else:
        return HttpResponse(verify_failure, content_type="text/html")
