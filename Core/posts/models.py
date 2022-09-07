import uuid
import os
from django.db import models
from django.utils import timezone
from django.urls import reverse
from mptt.models import MPTTModel, TreeForeignKey
from ckeditor.fields import RichTextField
import datetime
def recipe_file_path(instance, filename):
    """generate file path"""
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'

    return os.path.join('uploads/recipe/', filename)

class CategoryMptt(MPTTModel):
   TEST1 = 'T1'
   TEST2 = 'T2'
   TEST3 = 'T3'
   TEST4 = 'T4'

   TEST_TYPES = (
       (TEST1, 'test one'),
       (TEST2, 'test two'),
       (TEST3, 'test three'),
       (TEST4, 'test four'))

   role = models.CharField(max_length=25, choices=TEST_TYPES, null=True, blank=True)
   category_name = models.CharField(max_length=200, unique=True)
   parent = TreeForeignKey('self', null=True, blank=True, related_name='categories', on_delete = models.CASCADE)

   def __str__(self):
       return "<CategoryMptt: {}>".format(self.category_name)

   def __repr__(self):
       return self.__str__()

class Tags(models.Model):

    tag_name = models.CharField(max_length=50, unique=True)

    def __str__(self):
       return "<Tags: {}>".format(self.tag_name)

    def __repr__(self):
       return self.__str__()

class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    author = models.ForeignKey('accounts.UserProfileInfo', on_delete = models.CASCADE)
    title = models.CharField(max_length=200)
    text = RichTextField()
    category = models.ManyToManyField(CategoryMptt)
    tags = models.ManyToManyField(Tags)
    created_date = models.DateTimeField(default=timezone.now)
    published_date = models.DateTimeField(blank=True, null=True)    
    image = models.ImageField(blank=True, null=True, upload_to = 'images/')
    

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def approve_comments(self):
        return self.comments.filter(approved_comment=True)

    def get_absolute_url(self):
        return reverse("posts:post_detail",kwargs={'pk':self.pk})

    def __repr__(self):
        return self.__str__()

    def __str__(self):
        return self.title

class Likes(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey('accounts.UserProfileInfo', on_delete = models.CASCADE)
    post = models.ForeignKey('posts.Post', related_name='likes', on_delete = models.CASCADE)
    liked = models.BooleanField(default=False)

    def __str__(self):
       return "<Liked: {}>".format(self.liked)

    def __repr__(self):
       return self.__str__()

class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    post = models.ForeignKey('posts.Post', related_name='comments', on_delete = models.CASCADE)
    author = models.ForeignKey('accounts.UserProfileInfo', on_delete = models.CASCADE)
    text = models.TextField()
    created_date = models.DateField(blank=False, default=timezone.now)
    approved_comment = models.BooleanField(default=False)

    def approve(self):
        self.approved_comment = True
        self.save()

    def get_absolute_url(self):
        return reverse("post_list")

    def __str__(self):
        return self.text
def date_created():
    return datetime.datetime.now().date()

class Reply(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    author = models.ForeignKey('accounts.UserProfileInfo', on_delete = models.CASCADE)
    comment = models.ForeignKey('posts.Comment', on_delete = models.CASCADE, related_name="replies")
    text = models.TextField()
    date_posted = models.DateField(blank=False, default=timezone.now)


class PostReport(models.Model):
    reasons = [
        (0, 'Harassment or bullying'),
        (1, 'Nudity'),
        (2, 'Misinformation or Fake news'),
        (3, 'Harmful or dangerous acts'),
        (4, 'Violent or repulsive content'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True) 
    post = models.ForeignKey('posts.Post', on_delete = models.CASCADE)
    reporter = models.ForeignKey('accounts.UserProfileInfo', on_delete = models.CASCADE)
    reason = models.IntegerField(choices=reasons, null=False, blank=False, default=0)
    date = models.DateField(default=date_created)
    #add value field that tracks the user making the report. How much impact they make will depend on their activity
