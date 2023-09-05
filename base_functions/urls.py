from django.urls import path

from . import views

urlpatterns = [
    path("hello", views.index, name="index"),
    path("test", views.index, name="index2"),
]