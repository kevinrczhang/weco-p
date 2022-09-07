from django.contrib import auth
from django.db import models
from django.db.models.fields.files import ImageField
from django.utils import timezone
from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager
from django.conf import settings
from mptt.models import MPTTModel, TreeForeignKey
import uuid
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from datetime import datetime
import django.utils.timezone
class AccountManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError("please enter email")
        if not username:
            raise ValueError("you must have a username!")
        user = self.model(
            email=self.normalize_email(email),
            username = username,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, username, password):
        user = self.create_user(
            email = self.normalize_email(email),
            password=password,
            username=username,  
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

def links_json_default():
    return {
        'website': '',
        'twitter': '',
        'facebook': '',
        'instagram': '',
        'linkedin': '',
        'youtube': '',
        'twitch': '',
    }

class UserProfileInfo(AbstractBaseUser):
    email = models.EmailField(verbose_name= "email", max_length=60, unique=True)
    username = models.CharField(max_length=30, unique=True)
    real_name = models.CharField(max_length=69, unique=False, default='Cool User')
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    biography = models.CharField(max_length=2000, unique=False, blank=True)
    profile_image = models.ImageField(upload_to='images/', max_length=255, null=True, blank=True, default='/profilepicture.jpg')
    background_image = models.ImageField(upload_to='images/', max_length=255, null=True, blank=True, default='default_images/banner.jpg')
    # XXX: Deleted old field and added new field because Django will complain otherwise.
    # Converting a CharField to a JSONField doesn't work well, especially since
    # the CharField we stored was empty.
    # 03/30/2022 Take-Some-Bytes
    # links = models.CharField(max_length=500, unique=False, blank=True)
    links_json = models.JSONField('External links - JSON', unique=False, null=True, blank=True,  default=links_json_default)
    interests = models.ManyToManyField('Interests')
    tags = models.ManyToManyField('InterestTags')
    date_joined = models.DateTimeField(auto_now_add=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS =  ['username', 'password'] 
    objects = AccountManager()
    class Meta:
        ordering = ['email']

    def interests_self(self):
        return ', '.join([i.interests_self for i in self.interests.all()])

    def __str__(self):
        # Built-in attribute of django.contrib.auth.models.User !
        return self.email

    def has_perm(self, perm, obj =None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True
    def get_absolute_url(self):
        return reverse("accounts:user_detail",kwargs={'pk':self.pk})

class UserFollowing(models.Model):
    #related name is used for the user to call the fields, instead of using _set
    #naming is a little weird with this for both field and related_names, beware
    user_id = models.ForeignKey("UserProfileInfo", related_name="following", on_delete = models.CASCADE)#the user themself
    following_user_id = models.ForeignKey("UserProfileInfo", related_name="followers", on_delete = models.CASCADE) #the user that user_id is following
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user_id', 'following_user_id']

class Interests(MPTTModel):
    # main interest = broad topic e.g sports, technology
    # sub interest = subcategory of a main interest
    # e.g. if main interest = sports, then sub interest = soccer, hockey
    # feel free to add more layers to this if need be
    MainInterest = 'MI'
    SubInterest = 'SI'

    INTEREST_ROLE = (
        (MainInterest, 'main'),
        (SubInterest, 'sub'),
    )

    role = models.CharField(max_length = 100, choices = INTEREST_ROLE, default='')
    interest_name = models.CharField(max_length=200, default='', unique=True)
    # blank=True so Django would allow the parent field to have no value when
    # modifying/creating it in the admin site.
    parent = TreeForeignKey('self', null=True, blank=True, related_name='categories', on_delete = models.CASCADE)


    def __str__(self):
       return "<Interests: {}>".format(self.interest_name)

    def __repr__(self):
       return self.__str__()


#I'm not sure if we will need MPTT for this, but its a good idea just in case
#the names for ecah thing like interest_tag_name are really specific to avoid naming problems in the future
class InterestTags(models.Model):
    interest_tag_name = models.CharField(max_length=200, default='', unique=True)



#https://www.youtube.com/watch?v=Wv5jlmJs2sU
User = get_user_model()
class Contact(models.Model):
    user = models.ForeignKey(
        User, related_name='friends', on_delete=models.CASCADE)
    friends = models.ManyToManyField('self', blank=True)

    def __str__(self):
        return self.user.username


class Message(models.Model):
    contact = models.ForeignKey(
        Contact, related_name='messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.contact.user.username


class Chat(models.Model):
    participants = models.ManyToManyField(
        Contact, related_name='chats', blank=True)
    messages = models.ManyToManyField(Message, blank=True)

    def __str__(self):
        return "{}".format(self.pk)