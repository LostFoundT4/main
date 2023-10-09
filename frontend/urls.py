from django.urls import path , include
from .views import index

urlpatterns = [
    path('sign-up', index),
    path('sign-in', index),
    path('home', index),
    path('edit-profile', index),
    path('dashboard',index),
    path('profile-page', index)
    path('my-items', index)
]