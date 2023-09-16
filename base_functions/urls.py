from django.urls import path

from . import views

urlpatterns = [
    path("hello", views.index, name="index"),
    path("test", views.hello2, name="index2"),
]