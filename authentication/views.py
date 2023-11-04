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

            /* Style the hyperlink as a button */
            .login-button {
                background-color: #6cf3c3;
                color: #000; /* Font color is black */
                text-decoration: none; /* Remove underline */
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.4s;
            }

            .login-button:hover {
                background-color: #2dd197; /* Hover background color */
            }
        </style>
        <link href="https://fonts.googleapis.com/css?family=Lexend+Deca" rel="stylesheet">
    </head>
    <body>
        <div class="email-confirmation">
            <h1>Thank you for your email confirmation.</h1>
            <p><a href="/frontend/sign-in" class="login-button">Log in to your account</a></p>
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
    
def password_reset(request, uidb64, token):
    reset_setup = """"
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            /* Set the background color for the entire page */
            body {
                background-color: #000; /* Background color is black */
            }

            /* Center the message both horizontally and vertically */
            .password-reset {
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

            /* Style the input fields and submit button */
            .password-input {
                width: 100%;
                padding: 10px;
                margin: 10px 0;
                border: none;
                border-radius: 5px;
            }

            .submit-button {
                background-color: #6cf3c3;
                color: #000; /* Font color is black */
                text-decoration: none; /* Remove underline */
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.4s;
            }

            .submit-button:hover {
                background-color: #2dd197; /* Hover background color */
            }
        </style>
        <link href="https://fonts.googleapis.com/css?family=Lexend+Deca" rel="stylesheet">
    </head>
    <body>
        <div class="password-reset">
            <h1>Input your new password</h1>
            <form action="/password-reset" method="post">
                <input type="password" name="password" class="password-input" placeholder="New Password" required>
                <input type="password" name="confirm_password" class="password-input" placeholder="Confirm Password" required>
                <button type="submit" class="submit-button">Reset Password</button>
            </form>
        </div>
    </body>
    </html>
    """
    
    reset_success = """
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            /* Set the background color for the entire page */
            body {
                background-color: #000; /* Background color is black */
            }

            /* Center the message both horizontally and vertically */
            .password-reset-success {
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

            /* Style the submit button */
            .submit-button {
                background-color: #6cf3c3;
                color: #000; /* Font color is black */
                text-decoration: none; /* Remove underline */
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.4s;
            }

            .submit-button:hover {
                background-color: #2dd197; /* Hover background color */
            }
        </style>
        <link href="https://fonts.googleapis.com/css?family=Lexend+Deca" rel="stylesheet">
    </head>
    <body>
        <div class="password-reset-success">
            <h1>Password Reset Success</h1>
            <p>Your password has been successfully reset.</p>
            <a href="/frontend/sign-in" class="submit-button">Log in to your account</a>
        </div>
    </body>
    </html>
    """

    reset_failure = """
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            /* Set the background color for the entire page */
            body {
                background-color: #000; /* Background color is black */
            }

            /* Center the message both horizontally and vertically */
            .password-reset-failure {
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

            /* Style the submit button */
            .submit-button {
                background-color: #6cf3c3;
                color: #000; /* Font color is black */
                text-decoration: none; /* Remove underline */
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.4s;
            }

            .submit-button:hover {
                background-color: #2dd197; /* Hover background color */
            }
        </style>
        <link href="https://fonts.googleapis.com/css?family=Lexend+Deca" rel="stylesheet">
    </head>
    <body>
        <div class="password-reset-failure">
            <h1>Failed to Reset Password</h1>
            <p>Your password reset request has failed.</p>
            <a href="/frontend/sign-in" class="submit-button">Try again here</a>
        </div>
    </body>
    </html>
    """
    
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if request.method == 'POST':
        # Handle the password reset form submission here
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        if user is not None and account_activation_token.check_token(user, token):
            # Check if the passwords match and update the user's password
            if password == confirm_password:
                user.set_password(password)
                user.save()
                login(request, user)
                return HttpResponse(reset_success, content_type="text/html")
            else:
                # Passwords don't match, show an error message or redirect to reset_setup
                return HttpResponse(reset_setup, content_type="text/html")
        else:
            return HttpResponse(reset_failure, content_type="text/html")

    # If it's a GET request, simply show the reset_setup page
    return HttpResponse(reset_setup, content_type="text/html")
