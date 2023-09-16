from django.urls import path , include
from .views import index

urlpatterns = [
    path('sign-up', index),
    path('sign-in', index),
    path('profile-page', index),
    path('edit-profile', index)
]