from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from notifications.permissions import IsCurrentUser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view
from rest_framework.response import Response
from notifications.serializers import NotificationSerializer
from notifications.models import Notification
from rest_framework.decorators import action


class GetNotifications(APIView):

    permission_classes = (IsCurrentUser, IsAuthenticated)
    def get(self, request, format=None):
        user = request.user
        notifications = user.user.all()
        serialized_notifications = NotificationSerializer(notifications, many=True).data
        return Response(serialized_notifications)
    
class ManageNotifications(APIView):

    permission_classes = (IsCurrentUser, IsAuthenticated)
    def post(self, request, format=None):
        notifications = Notification.objects.filter(receiver=request.user)
        for i in notifications:
            i.read = True
        
        Notification.objects.bulk_update(notifications, ['read'])

        return Response(NotificationSerializer(notifications, many=True).data)
    @action(methods=['POST'], detail=True)
    def delete_notif(self, request):
        Notification.objects.delete(id=request.data.get('id'))

        return Response("notification deleted")
@api_view(['POST'])
def test(request):
    n = Notification.objects.create(title="test test test", sender=request.user, receiver=request.user, text='this is a test')
    s = NotificationSerializer(n).data
    return Response(s)