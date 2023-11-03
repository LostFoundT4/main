from django.urls import path , include
from .views import index

urlpatterns = [
    path('', index),
    path('sign-up', index),
    path('sign-in', index),
    path('home', index),
    path('edit-profile', index),
    path('profile-page', index),
    path('my-listings', index)
]