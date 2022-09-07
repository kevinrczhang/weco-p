from django.db.models.fields.files import ImageField
from rest_framework import serializers
from accounts.models import UserProfileInfo, Interests, InterestTags, UserFollowing
from django.contrib.auth import authenticate # use the custom built authentication later
from django.utils.translation import ugettext_lazy as _
import datetime as dt
import json
from rest_framework import exceptions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
import random
import string
from django.db import IntegrityError

class ForeignAccountSerializer(serializers.ModelSerializer): #Similar to AccountSerializer, but does not return users email
    class Meta:
        model = UserProfileInfo
        exclude = ('email', 'is_admin', 'is_active', 'is_staff', 'is_superuser', 'date_joined')

    def to_representation(self, instance):
        """Convert ``interests`` and ``tags`` to something useful, instead of leaving them as IDs."""
        ret = super().to_representation(instance)
        # Return the actual interests and tags, not just IDs.
        ret['interests'] = list(map(
            lambda interest_id: InterestSerializer(Interests.objects.get(id=interest_id)).data,
            ret['interests']
        ))
        ret['tags'] = list(map(
            lambda tag_id: TagSerializer(InterestTags.objects.get(id=tag_id)).data,
            ret['tags']
        ))
        return ret

class AccountSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    class Meta:
        model = UserProfileInfo
        exclude = ('is_admin', 'is_active', 'is_staff', 'is_superuser', 'date_joined')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save_account(self):
        account = UserProfileInfo(
            email = self.validated_data['email'],
            username = self.validated_data['username']
        )
        password = self.validated_data['password']
        password2 = self.validated_data['username']

        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords must match'})
        account.set_password(password)
        account.save()

    def update_password(self, instance, validated_data): #get the instance of the class  
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        if 'password' in validated_data:        
            password = validated_data.pop('password', None)    
            user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()
        return user    

    def to_representation(self, instance):
        """Convert ``interests`` and ``tags`` to something useful, instead of leaving them as IDs."""
        ret = super().to_representation(instance)
        # Return the actual interests and tags, not just IDs.
        ret['interests'] = list(map(
            lambda interest_id: InterestSerializer(Interests.objects.get(id=interest_id)).data,
            ret['interests']
        ))
        ret['tags'] = list(map(
            lambda tag_id: TagSerializer(InterestTags.objects.get(id=tag_id)).data,
            ret['tags']
        ))
        return ret 

class FollowSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = UserFollowing
        fields = '__all__'

class AuthTokenSerializer(serializers.Serializer):
    #serializer for user authentication 
    #https://www.youtube.com/watch?v=Wq6JqXqOzCE&feature=emb_logo
    email = serializers.CharField()
    password = serializers.CharField(
        style = {'input_type': 'password'}
        #trim_whitespace=False
    )
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(
             request = self.context.get('request'),
             username = email,
             password = password
         )
        if not user:
             msg = ('unable to authenticate with provided credentials')
             raise serializers.ValidationError(msg, code = 'authentication')
        attrs['user'] = user 
        return attrs


#user interest serializer here
class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interests
        fields = ('interest_name', 'id')

class InterestNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interests
        fields = ('interest_name',)

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterestTags
        fields = ('interest_tag_name','id')
        read_only_fields = ('user',) #need this to save the tag to current user
class TagNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterestTags
        fields = ('interest_tag_name',)

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfileInfo
        fields = ('email', 'username', 'password',)

        extra_kwargs = {
            'password':{'write_only': True},
        }

    def create(self, validated_data): 
        password = validated_data.get('password')
        id = ''.join(random.choices(string.digits, k=9))
        user = None
        try:
            user = UserProfileInfo.objects.create(**validated_data, id=id)
        except IntegrityError:
            self.create(validated_data)
        user.set_password(password)
        user.is_active = True
        user.save()
        return user

class UserProfileInfoBoxSerializer(serializers.ModelSerializer):
    class Meta:
          model = UserProfileInfo
          fields = ('id', 'username', 'profile_image', 'interests', 'biography', 'tags')
#python manage.py dumpdata --natural-foreign --exclude=auth.permission --exclude=contenttypes --indent=4 > data.json
      

