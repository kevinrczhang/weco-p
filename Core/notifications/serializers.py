from rest_framework import serializers
from notifications.models import Notification
from accounts.models import UserProfileInfo

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__' 

    def to_representation(self, instance):
        """Convert ``sender`` to a username."""
        ret = super().to_representation(instance)
        try:
            ret['sender'] = UserProfileInfo.objects.get(id=ret['sender']).username
        except UserProfileInfo.DoesNotExist:
            ret['sender'] = 'Invalid user'

        return ret
