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
    path('frontend/', include("frontend.urls")),

    # CRUD for base_functions
    path('tickets/', base_views.ticket_list),
    path('tickets/<int:id>', base_views.ticket_detail),
    path('items/', base_views.item_list),
    path('items/<int:id>', base_views.item_detail),

    # CRUD for reporting
    path('locations/', reporting_views.location_list),
    path('locations/<int:id>', reporting_views.location_detail),
    path('reportInfos/', reporting_views.reportInfo_list),
    path('reportInfos/<int:id>', reporting_views.reportInfo_detail),
    path('status/', reporting_views.status_list),
    path('status/<int:id>', reporting_views.status_detail)
]
