from django.urls import path, include, re_path
from .api import PasswordResetAPI, RegisterAPI, LoginAPI, UserAPI, UpdateProfileView
from .views import activate, password_reset
from knox import views as knox_views

urlpatterns = [
    path('api/auth', include('knox.urls')),
    path('api/auth/register', RegisterAPI.as_view()),
    path('api/auth/login', LoginAPI.as_view()),
    path('api/auth/get-user', UserAPI.as_view()),
    path('api/auth/updateProfile/<int:pk>/', UpdateProfileView.as_view(), name='auth_update_profile'),
    path('api/auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('activate/<uidb64>/<token>/', activate, name='activate'),
    
    path('api/auth/password_reset', PasswordResetAPI.as_view()),
    path('password_reset/<uidb64>/<token>/', password_reset, name='password_reset'),



]