from django.db import models
import uuid
import os
from django.urls import reverse
from django.db.models.signals import post_save
import datetime
from django.dispatch import receiver
from django.utils import timezone
def destruction_date_default():
    return datetime.datetime.now().date() + datetime.timedelta(days=14)

class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    title = models.CharField(max_length=500, unique=False, null=False)
    text = models.CharField(max_length=1000, unique=False, blank=True)
    receiver = models.ForeignKey('accounts.UserProfileInfo', on_delete=models.CASCADE, related_name='user')
    sender = models.ForeignKey('accounts.UserProfileInfo', on_delete=models.CASCADE, blank=True, null=True, related_name='giver')
    post = models.ForeignKey('posts.Post', on_delete=models.CASCADE, blank=True, null=True)
    destruction_date = models.DateField(default=destruction_date_default)
    read = models.BooleanField(default=False, null=False, blank=False)
    created_date = models.DateTimeField(default=timezone.now)
    #custom method that deletes a notification after 14 days
    def destroy(self, *args, **kwargs):
        if self.destruction_date == datetime.datetime.now().date() + datetime.timedelta(days=14):
            self.delete()

