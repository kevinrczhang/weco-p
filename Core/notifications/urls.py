from django.conf.urls import url, include
from django.contrib.auth import views as auth_views
from notifications import views
from django.urls import include, path
from rest_framework import routers

app_name = 'notifications'

urlpatterns = [
    path("notifications/", views.GetNotifications.as_view()),
    path('read/', views.ManageNotifications.as_view()),
    path('delete/', views.ManageNotifications.delete_notif),
    path('test', views.test)

]
