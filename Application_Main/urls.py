"""
URL configuration for Application_Main project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from base_functions import views as base_views
from reporting import views as reporting_views


urlpatterns = [
    path('accounts/', include('django.contrib.auth.urls')),
    path("base/", include("base_functions.urls")),
    path('admin/', admin.site.urls),
    path('', include("frontend.urls")),

    #Authentication APIs Here
    path('', include('authentication.urls')),

    # API for base_functions
    path('tickets/', base_views.ticket_list),
    path('tickets/<int:id>', base_views.ticket_detail),
    path('items/', base_views.item_list),
    path('items/<int:id>', base_views.item_detail),
    path('userProfiles/', base_views.userprofile_list),
    path('userProfiles/<int:id>', base_views.userprofile_detail),
    path('userProfileswithUserID/<int:id>', base_views.userprofile_detail_withUserID),
    path('reputation/', base_views.reputation_list),
    path('reputation/<int:id>', base_views.reputation_detail),
    path('reputationwithUserID/<int:id>', base_views.reputation_detail_withUserID),
    path('blacklist/', base_views.blacklist_list),
    path('blacklist/<int:id>', base_views.blacklist_detail),
    path('verifyStatus/<int:id>', base_views.checkUserVerificationStatus),

    # API for reporting
    path('locations/', reporting_views.location_list),
    path('locations/<int:id>', reporting_views.location_detail),
    path('reportInfos/', reporting_views.reportInfo_list),
    path('reportInfos/<int:id>', reporting_views.reportInfo_detail),
    path('status/', reporting_views.status_list),
    path('status/<int:id>', reporting_views.status_detail),
    path('pendingUsers/', reporting_views.pendingUsers_list),
    path('pendingUsers/<int:id>', reporting_views.pendingUsers_detail),
    path('claimTicket/<int:id>', reporting_views.claim_foundItem),
    path('endorseTicket/<int:id>', reporting_views.endorsed_foundItem),
    path('closeTicket/<int:id>', reporting_views.close_ticket)


]
