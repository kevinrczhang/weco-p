from django.contrib.auth import login, logout, get_user_model
from accounts.backends import EmailOrUsernameModelBackend 
from django.views.generic import CreateView
from django.shortcuts import render, get_object_or_404
from django.views import generic
from django.http import HttpResponse
from django.shortcuts import redirect
from accounts.models import UserProfileInfo, Interests, InterestTags, UserFollowing
from accounts import models, serializers, permissions
#from django.contrib.auth.forms import 
from rest_framework import viewsets, status 
from rest_framework.generics import RetrieveAPIView, UpdateAPIView
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes, action, parser_classes
from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from rest_framework.parsers import FileUploadParser
from django.conf import settings
from django.views import View
from django.views.decorators.csrf import csrf_exempt,csrf_protect
from accounts.serializers import AccountSerializer, AuthTokenSerializer, ForeignAccountSerializer
from .serializers import (RegisterSerializer, InterestSerializer, TagSerializer, UserProfileInfoBoxSerializer,
 AccountSerializer, AuthTokenSerializer, FollowSerializer, InterestNameSerializer, TagNameSerializer)
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.authtoken.views import ObtainAuthToken 
from rest_framework.authentication import TokenAuthentication
from rest_framework.settings import api_settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import filters
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import copy
from accounts.functions import spotted, transform_user #spotted function for the algorithm
from rest_framework_simplejwt.tokens import RefreshToken
from django.middleware import csrf
from posts.models import Post
from django.http import JsonResponse, Http404
from posts.serializer import PostSerializer
from django.core.exceptions import ObjectDoesNotExist
import json
from better_profanity import profanity
from notifications.models import Notification
from notifications.serializers import NotificationSerializer
        ##################################
        #      function based views      #
        ##################################

#restricts how much data is being shown on screen
def infinite_filter(request):
    url_parameter = request.GET.get('p')
    if url_parameter:
        limit = request.GET.get('l') #limit
        offset = request.GET.get('o') #offset, where we last stopped from data fetching
        if limit and offset:
            return UserProfileInfo.objects.filter(username__icontains=url_parameter)[:int(offset) + int(limit)] # this is for the user list
        elif limit:
             return UserProfileInfo.objects.filter(username__icontains=url_parameter)[:int(limit)] #this is for the search list
        else:
            return UserProfileInfo.objects.filter(username__icontains=url_parameter)[:15]
    return UserProfileInfo.objects.all()[:40]

#returns true or false depending on if the userprofileinfo queryset has more data than offset
def has_more_data(request):
    o = request.GET.get('o')
    l = request.GET.get('l')
    if o:
        return UserProfileInfo.objects.all().count() > int(o)

    elif l:
        return UserProfileInfo.objects.all().count() > int(l)
    else: 
        return False
#this and function below are not api views, meant to pass data within the backend
#probably a more efficient way of doing this, but this'll do for now
def ReturnIntNames(request):
    names = request.user.interests.all().values_list('interest_name', flat=True)

    return names

def ReturnTagNames(request):
    names = request.user.tags.all().values_list('interest_tag_name', flat=True)
    return names

        ###################################
        #      USER MANAGEMENT VIEWS      #
        ###################################

class UserListViewset(viewsets.ModelViewSet): 
    serializer_class =  serializers.ForeignAccountSerializer
    queryset = models.UserProfileInfo.objects.all()
    authentication_classes = (JWTAuthentication,)
    permission_classes = [AllowAny,] 
    search_fields = ('username')
    filter_backends = (filters.SearchFilter,)
    def get_queryset(self):
        queryset = infinite_filter(self.request)
        return queryset
    def list(self, request):
        url_parameter = request.GET.get('p') #parameters for data filter
        if url_parameter:
            users = self.get_queryset()
        
            serialized_data = ForeignAccountSerializer(users, many=True)

            return Response({
                "users" : serialized_data.data,
                "more_data" : has_more_data(request)
            })

        return Response(ForeignAccountSerializer(UserProfileInfo.objects.all()[:10], many=True).data)


#this allows the user to update their own profile if necessary
class UserDetailAPIView(generics.UpdateAPIView):
    serializer_class = serializers.AccountSerializer
    queryset = models.UserProfileInfo.objects.all()
    permission_classes = (IsAuthenticated, permissions.UpdateOwnProfile)
    parser_classes = [MultiPartParser, JSONParser]
    def check_permissions(self, request):
        return self.get_object()#permission will only be checked if you have this

    def get(self, request, pk):

        user_id = pk
        if user_id is None:
            return Response("no id was provided!")

        user = UserProfileInfo.objects.all().get(id=user_id)

        try:
            #will use ForeignAccountSerializers to prevent access to other's usernames
            serializer = ForeignAccountSerializer(user).data

            return Response(serializer)
        except user.DoesNotExist:
            raise Http404
    @api_view(('GET',))
    def get_self(request):
        user = request.user
        try:
            serializer = AccountSerializer(user).data

            return Response(serializer)
        except user.DoesNotExist:
            raise Http404


    def patch(self, request, pk, format=None):
        #serialize data from FILES in the request(in this case, images)
        #pass in instance so serializer knows which UserProfileInfo model to save this to#for the background image 

        # QUESTION: Is input validation required here?
        # Old-time logic would categorize this function as insecure;
        # am I missing something?
        # (04/02/2022) Take-Some-Bytes

        data = request.data.copy()
        response_dict = {}
        parsed_tags = []
        parsed_interests = []
        #restrict the file size to 2 megabytes since the server can't handle it
        if request.FILES.get('profile_image'):
            if request.FILES.get('profile_image').size > 2000000:
                return Response('Please upload a file smaller than 2 megabytes')
        #extra code below is because better-profanity censors "hello" for some reason
        if data.get('username'):
            raw_username = copy.deepcopy(data.get('username')) 
            #replace all "hello"'s with [$|temp_word|$]
            replaced_text = " ".join([str(i).replace("hello","[$|temp_word|$]") for i in raw_username.split("  ")])
            processed_username = profanity.censor(" ".join(replaced_text)) #add spaces in between so censor() can detect hidden swear words
            #return the text back to normal. E.g H E Y  T H E R E -> HEY THERE
            final_username = " ".join([str(i).replace(" ","") for i in processed_username.split("  ")])
            #replace [$|temp_word|$] back to "hello"
            final_username = " ".join([str(i).replace("[$|temp_word|$]","hello") for i in final_username.split("  ")])
            if '*' in final_username: 
                response_dict['username'] = "Please choose another username"
        if data.get('real_name'):
            raw_name = copy.deepcopy(data.get('username')) 
            replaced_text = " ".join([str(i).replace("hello","[$|temp_word|$]") for i in raw_name.split("  ")])
            processed_name = profanity.censor(" ".join(replaced_text))
            final_name = " ".join([str(i).replace(" ","") for i in processed_name.split("  ")])
            final_name = " ".join([str(i).replace("[$|temp_word|$]","hello") for i in final_name.split("  ")])
            if '*' in final_name: 
                response_dict['real_name'] = "Please choose another name"
            
        if response_dict.get("username") or response_dict.get("real_name"):
            return Response(response_dict)
       
        if data.get('biography') is not None: 
            bio = request.data.get('biography')
            split_text = copy.deepcopy(bio)

            replaced_text = " ".join([str(i).replace("hello","[$|temp_word|$]") for i in split_text.split("  ")])
            filtered_bio = profanity.censor(" ".join(replaced_text))
            final_bio = " ".join([str(i).replace(" ","") for i in filtered_bio.split("  ")])
            final_bio = " ".join([str(i).replace("[$|temp_word|$]","hello") for i in final_bio.split("  ")])

            data.update({'biography': final_bio})

        if data.get('tags'):
            parsed_tags = json.loads(data.get('tags'))
            data.pop('tags')

        filtered_bio = None
        if data.get('interests'):
            parsed_interests = json.loads(data.get('interests'))
            data.pop('interests')

        serializer = AccountSerializer(data=data, instance=request.user, partial=True)
        if serializer.is_valid(): #just to double check 
            updated_user = serializer.save()
            if parsed_tags:
                updated_user.tags.clear() #to remove any existing relations, and completely replace with new relations
                for i in parsed_tags:
                    updated_user.tags.add(InterestTags.objects.get(interest_tag_name=i))
            if parsed_interests:
                updated_user.interests.clear()
                for i in parsed_interests:
                    updated_user.interests.add(Interests.objects.get(interest_name=i))
            return Response(serializer.data)
        return Response(serializer.errors)
    @api_view(('GET',))
    def get_all_posts(request, pk):
        user_id = pk

        if user_id is None:
            return Response("No ID was provided")
        current_user = UserProfileInfo.objects.get(id=user_id)
        user_posts = current_user.post_set.all()
        try:
            serializer = PostSerializer(user_posts, many=True)
            return Response(serializer.data)
        except current_user.DoesNotExist:
            raise Http404
            
    @api_view(('GET',))
    def get_current_user_id(request):
        if request.user.is_authenticated:
            notifications = request.user.user.all()
            for notification in notifications: #check if user's notifications is outdated
                notification.destroy()


            return Response(request.user.id)
        return Response(status=401)

    @api_view(('POST',))
    def notif(request):
        result = Notification.objects.create(title=request.user.username + ' has followed you!', receiver=request.user, sender=request.user,)
        result.save()
        return Response(NotificationSerializer(result).data)


#retrieve specific user
class UserLoginAPIView(ObtainAuthToken):
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES

class RegisterApi(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    def post(self, request, *args,  **kwargs):
        raw_data = request.data
        data = raw_data.copy()
        processed_username = None
        if data.get('username') and data.get('email') and data.get('password'):
            raw_username = copy.deepcopy(data.get('username') + " ")
            processed_username = profanity.censor(" ".join(raw_username))
            if "*" in processed_username:
                return Response('Please choose another username')
            if UserProfileInfo.objects.filter(username=data.get('username')).exists():
                return Response("Username not available")

            if UserProfileInfo.objects.filter(email=data.get('email')).exists():
                return Response("That email is already registered")
            serializer = RegisterSerializer(data=data)
        else:
            return Response('Seems like you have left a field blank!')
        if serializer.is_valid():
            new_user = serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors)


#IMPORTANT NOTE: You will need to prevent emails from being returned in this viewset
class GetUserByInterest(viewsets.ReadOnlyModelViewSet):
    queryset = UserProfileInfo.objects.all()
    serializer_class = AccountSerializer
    @action(methods=['GET'], detail=True)
    def get_user_by_interest(self, request, pk=None, **kwargs):
        interest = Interests.objects.get(id=self.kwargs.get('pk'))
        users = interest.userprofileinfo_set.all().exclude(user=request.user) #_set accesses related items from indirect relationships
        user_json = AccountSerializer(users, partial=True, many=True)

        return Response(user_json.data)

    @api_view(['GET'])
    def get_user_by_tag(request):

        try:
            request_tags = request.data.get('interest_tag_name')

        except request_tags.DoesNotExist:

            return Response('You must enter a tag name!!')

        input_tags = InterestTags.objects.get(interest_tag_name=request_tags)
        #get all users related to entered tags
        users = input_tags.user.objects.all().exclude(user=request.user)

        serialized_user = AccountSerializer(users, partial=True, many=True)

        return Response(serialized_user.data)

#custom authentication for cookie storage
def get_tokens_for_user(user): 
    refresh = RefreshToken.for_user(user)
        
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class LoginView(APIView): #this is currently storing it directly on the browser, however need to find a way to get react to get it
#https://www.google.com/search?q=jdango+set+cookie+in+reawct&rlz=1C1CHBF_enCA921CA921&oq=jdango+set+cookie+in+reawct&aqs=chrome..69i57j33i10i160l2.4173j0j7&sourceid=chrome&ie=UTF-8
    permission_classes = (AllowAny,)
    def post(self, request, format=None):
        data = request.data
        response = Response()        
        username = data.get('username', None)
        password = data.get('password', None)
        user =  EmailOrUsernameModelBackend.Authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                data = get_tokens_for_user(user)
                response.set_cookie(
                                    key = settings.SIMPLE_JWT['AUTH_COOKIE'], 
                                    value = data["access"],
                                    expires = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                                    secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                                    httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                                    samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                                    max_age=259200012
                                        )
                
                csrf_token = csrf.get_token(request)
                #this is to send a "you have logged in successfully!" email to the user, we dont need that rn
                """ 
                email_template = render_to_string('login_success.html',{"username":user.username})    
                login = EmailMultiAlternatives(
                    "Successfully Login", 
                    "Successfully Login",
                    settings.EMAIL_HOST_USER, 
                    [user.email],
                )
                login.attach_alternative(email_template, 'text/html')
                login.send()
                """
                response.data = {"Success" : "Login successful","data":data, "csrf:" : csrf_token}
                
                return response
            else:
                return Response({"Non active" : "This account is not active!!"},status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"Invalid" : "Invalid username or password!!"},status=status.HTTP_404_NOT_FOUND)
    #todo: short access token lifespan, send requests with refresh token. When logged out, invalidate refresh token
    #https://blog.indrek.io/articles/invalidate-jwt/
    def delete(self, request, format=None):
        response = Response()
        response.delete_cookie(
                key = settings.SIMPLE_JWT['AUTH_COOKIE'], 
            )
        response.data = {'successfully logged out'}
        return response
    
#use unique_together to prevent double follows 
class Follow(APIView):
    permission_classes = [IsAuthenticated, ]
    
    def post(self, request, format=None):
        username = request.user.username
        follow_user = UserProfileInfo.objects.get(username=request.data.get("follow")) #will have to enter user id
        followed_user = UserFollowing.objects.create(user_id=request.user, following_user_id=follow_user)
        user = UserProfileInfo.objects.get(username=request.data.get('follow'))
        user_data = FollowSerializer(followed_user)

        notification = Notification.objects.create(title=username + " has followed you!", receiver=user, sender=request.user)

        return Response(user_data.data)

    
    @api_view(['GET'])
    def get_following(request):
        user_params = request.GET.get('u')
        #based off the related_name in models
        user = UserProfileInfo.objects.get(id=user_params)
        following = user.following.all()
        following_users = []
        if following:
            for i in following:
                following_users.append(AccountSerializer(i.following_user_id).data)
            return Response({ "users": following_users})
            #serialized_data = FollowSerializer(following_users, many=True)
        else:
            return Response({'users':[]})

        #return Response(serialized_data.data)

    @api_view(['GET'])
    def get_followers(request):
        user_params = request.GET.get('u')
        user = UserProfileInfo.objects.get(id=user_params)
        #get all userfollowing objects related to it, then get all the user_ids, which are the followers
        followers = user.followers.all()
        follower_users = []
        if followers:
            for i in followers:
                follower_users.append(AccountSerializer(i.user_id).data)
            return Response({'users':follower_users})
            #serialized_data = FollowSerializer(followers, many=True)
        else:
            return Response({'users':[]})

        #return Response(serialized_data.data)
    @api_view(['DELETE'])
    def unfollow(request):
        current_user = request.user
        user_to_unfollow = request.data.get('unfollow')
        if user_to_unfollow is None:
            return Response('no data was provided')
        
        user_unfollow_id = UserProfileInfo.objects.get(username=user_to_unfollow)
        user_follow_model = UserFollowing.objects.get(user_id=request.user, following_user_id=user_unfollow_id)

        try:
            user_follow_model.delete()
            return Response('Successfully unfollowed')
        except user_follow_model.DoesNotExist:
            return Response('An error has occurred')

    @api_view(['GET'])
    def is_following(request):
        current_user = request.user 
        profile_user = request.GET.get('u')
        instance = None
        try:
            instance = UserFollowing.objects.get(user_id=current_user, following_user_id=profile_user)
            return Response(True)
        except ObjectDoesNotExist:
            return Response(False)
    @api_view(['GET'])
    def following_posts(request):
        current_user = request.user
        following_users = current_user.following.all()
        post_list = []
        #return Response(FollowSerializer(following_users, many=True).data)
        #return Response(FollowSerializer(following_users, many=True).data)

        for user in following_users:
            return Response(PostSerializer(user.following_user_id.post_set.all(),many=True).data)
@api_view(['GET'])
def test(request):
    query = UserProfileInfo.objects.all().order_by('?')
    new = query.exclude(id=436602417)
    e = new.values_list('id', flat=True)
    #s = AccountSerializer(new, many=True).data
    return Response(e)

def more_matches(request):
    o = request.GET.get('o')
    l = request.GET.get('l')
    if l and o:
        return UserProfileInfo.objects.all().count() > int(o + l)
    elif l:
        return UserProfileInfo.objects.all().count() > int(l)    
    return Response('offset or limit is missing')
#this will be matched using usernames, might be a good idea to use IDs later, but this will do for now

passed = []
once = False
class Match(APIView):  
    location = {}
    tag_location = {}
    """
    this function is to return location of users matched
    since JsonResponse can only return one dictionary at a time
    you must call interest_user_match first before calling this function 
    to get data
    """
    @api_view(['GET'])
    def return_location_matched(request): 

        return JsonResponse(Match.location)

    def get(self, request, *args):
        limit = int(request.GET.get('l'))
        offset = request.GET.get('o')
        global passed
        global once
        if not once:
            #set the initial values for passed
            passed = request.data.get('users')
            if passed:
                passed.append(request.user.id)
        recur = True #to prevent infinite recursion if not enough results
        matches = []
        if args:
            passed = copy.deepcopy(args[0])#for recursion
            matches.extend(args[1])
        if limit and offset:
            #exclude previous user ids, then append new random users onto the list
            if request.data.get('users'):
                _self = UserProfileInfoBoxSerializer(request.user)
                #will only execute if recursion is happening
                if passed:
                    limit2 = limit - len(passed) 
                    current = passed #should be a list of user id's
                    filtered_queryset = UserProfileInfo.objects.all().exclude(id__in=current)
                    if filtered_queryset.count() < 100:
                        recur = False
                    #can consider limiting queryset after we've created a match list later on
                    queryset = filtered_queryset.order_by('?')[:int(offset) + int(limit2)]   
                    users = UserProfileInfoBoxSerializer(queryset, many=True)
                    matchedUsers = [] 
                else:
                    current = request.data.get('users') #should be a list of user id's
                    current.append(request.user.id)
                    filtered_queryset = UserProfileInfo.objects.all().exclude(id__in=current)
                    queryset = UserProfileInfo.objects.all().order_by('?')[:int(offset) + int(limit)]
   
            else:
                recur = False
                _self = UserProfileInfoBoxSerializer(request.user)
                queryset = UserProfileInfo.objects.all().exclude(id=request.user.id).order_by('?')[:int(offset) + int(limit)]
                users = UserProfileInfoBoxSerializer(queryset, many=True)
                matchedUsers = []
        else:
            return Response("Either limit or offset was not provided!")
        #return a dict of keys that are the user's interests
        modified_user = transform_user(_self.data, 'interest')        
        for user in users.data:
            matchedInterests=[]
            for userInterest in user['interests']:
                #will compare key from modified_user with userInterest    
                #this will prevent us from having another nested for loop and waste time iterating through the user's interest every time
                if userInterest in modified_user: 
                    matchedInterests.append(userInterest)
                    user['matchedPercentage']=((len(matchedInterests)+1)/(len(user['interests'])+2)+(len(matchedInterests)+1)/(len(_self.data['interests'])+2))/2
                    user['matchedInterests']=matchedInterests
                    matchedUsers.append(user)
                    match=True
                    break
        matchedUsers.sort(key=lambda x: x.get('matchedPercentage'), reverse=True)
        modified_user = transform_user(_self.data, 'tag')
        for user in users.data:
            matchedInterestsTags=[]
            for userInterestTags in user['tags']:
                if userInterestTags in modified_user:
                    matchedInterestsTags.append(userInterestTags)
                    user['matchedTags']=matchedInterestsTags
                    matchedUsers.append(user)
                    match=True 
                    break

        for x in matchedUsers: #to remove duplicate dictionaries from list
            if x not in matches:
                matches.append(x)
        #if not enough users, use recursion to get enough users, and append the existing users into passed
        if request.data.get('users'):
            length = len(matches) + len(passed)
            once = True
            if recur:
                if length < limit: #not enough users that matched
                    for i in matches:
                        passed.append(i.get('id')) 
                    self.get(request, passed, matches)
        context= {
            "matchedUsers": matches,
            "has_more": more_matches(request)
        }
        return Response(context)

    @api_view(['GET']) #a faster version of the above matching algo, but faster. Tradeoff is that it won't return where the user matched 
    def match_without_location(request):
        limit = request.GET.get('l')
        offset = request.GET.get('o')
        modified_group = transform_user(request, "interest")
        if limit and offset:
            _self = UserProfileInfoBoxSerializer(request.user)
            queryset = UserProfileInfo.objects.all().exclude(id=request.user.id)[:int(offset) + int(limit)]
            users = UserProfileInfoBoxSerializer(queryset, many=True)
            matchedUsers = []
        else:
            return Response("Either offset or limit is missing")
        i = 0 #will be used to iterate through interests
        j = 0 #will be used to iterate through the current user's interests
        once = False#just ot make sure we only assign inverted_group's length to length once
        length = 0
        raw_matches = []
        interests_location = {}
        tags_location = {}
        #return Response(modified_group)
        #this will stop the algo if we have reached the end of the user's interests. 
        while i < len(_self.data['interests']) or j < length: 
            #matchedInterests = []
            if once == False:
                once = True
                length = len(modified_group)
            if _self.data['interests'][i] == list(modified_group.keys())[j]: #if the j'th value of inverted_group is equal to the i'th value of current_user
                j += 1
                users = modified_group[_self.data['interests'][i]] 

                raw_matches.extend(users)
                #raw_matches.extend([dict(item, **{'matchedInterest':matchedInterests}) for item in user])#add the values(people) of the dict into raw_matches
                #NOTE: need to do .extend() to get all values of list in existing list
                    
            else: # if no matches, then move on onto the next interest in inverted_group
                j+=1
                if j == length: #if j reaches the end of inverted_group, then reset every value and move on to the next interest in current_user
                    i += 1 
                    j = 0
                    length = 0
                    once = False
                    continue
              
            if j == length: #reset everything and move onto the next interest
                i += 1 
                j = 0 
                once = False
                length = 0
        i = 0 
        j = 0 
        once = False
        length = 0
        modified_group = transform_user(request, "tag")
        #return Response(modified_group)
        while i < len(_self.data['tags']) or j < length: 
            #matchedTags = []
            if once == False:
                once = True
                length = len(modified_group)
            if _self.data['tags'][i] == list(modified_group.keys())[j]: #if the j'th value of inverted_group is equal to the i'th value of current_user     
                j += 1
                users = modified_group[_self.data['tags'][i]] 
                raw_matches.extend(users)
                #NOTE: need to do .extend() to get all values of list in existing list
                    
            else: # if no matches, then move on onto the next interest in inverted_group
                j+=1
                if j == length: #if j reaches the end of inverted_group, then reset every value and move on to the next interest in current_user
                    i += 1 
                    j = 0
                    length = 0
                    once = False
                    continue
                
            if j == length: #reset everything and move onto the next interest
                i += 1 
                j = 0 
                once = False
                length = 0

        #removes duplicates in raw_matches, now contains dictionaries that have matchedTags...but some DON'T have matchedTags
        cleaned_matches = [i for n, i in enumerate(raw_matches) if i not in raw_matches[n + 1:]] 
        #Here we take all the dictionaries with matchedTags, and save those into the final match list. Complete!
        context= {
            "matchedUsers": cleaned_matches,
            "has_more": more_matches(request)
        }
        return Response(context)
    @api_view(['GET'])
    def return_tag_location_matched(request):

        return JsonResponse(tag_location)

    #separate function just for tags, to allow organization between tags and interests
    #The same algorithm as interest matching, but this one uses tag names instead of ids, since tags are unique to user




###################################
#    INTERESTS MANAGEMENT VIEWS   #
###################################

class InterestList(viewsets.ViewSet):
    permission_classes = [AllowAny, ]
    #search for interests AND tags
    def list(self, request):
        request_data = request.GET.get('q')
        if request_data:
            interest = Interests.objects.filter(interest_name__icontains=request_data)
        else:
            interest = Interests.objects.all()

        serialized_interests = []
        serialized_interests = InterestSerializer(interest, many=True)
        all_data = {}
        all_data['interests'] = serialized_interests.data
        return Response(all_data)
    @api_view(['POST'])
    def get_names(request):
        ids = request.data.get('interests')
        names = []
        for i in ids:
            names.append(InterestSerializer(Interests.objects.get(id=i)).data)
        return Response(names)


#this will be the view to handle custom user interest tags that they may put on their profile
#this could be merged in the InterestsManagement API
class TagManagement(generics.UpdateAPIView):
    serializer_class = TagSerializer
    queryset = InterestTags.objects.all()
    #create gen and sub tags are separate just in case we need control over them
    #also need to create in bulk(many in one request) create objects first, then serialize using tag serializer
    @api_view(['POST'])
    @parser_classes([MultiPartParser, JSONParser])
    @permission_classes([AllowAny])
    def create_gen_tags(request):
        #assuming request.data will be in json format
        tag_data = request.data.get('interest_tag_name') 
        numbers = 0
        tag_objects = []
        processed_tags = []
        if tag_data is None:

            return Response('You must enter a tag!')
        
        #for reference: https://stackoverflow.com/questions/37301022/django-model-not-automatically-creating-id
        for i in tag_data: 
            data = i               
            raw = copy.deepcopy(data)
            censored = profanity.censor(raw)
                                                                                     #to make sure the user didn't enter dupe tags
            if InterestTags.objects.all().filter(interest_tag_name=data).exists() or data in processed_tags:
                continue
            elif "*" in censored: #to prevent users from creating innappropriate tags
                continue
            else:
                tag_objects.append(InterestTags(
                interest_tag_name=data))   
                processed_tags.append(data)
        queryset = InterestTags.objects.bulk_create(tag_objects) #to store the bulk created objects
        serialized_data = tag_data

        return Response(serialized_data)      

        
    @api_view(['GET'])
    @permission_classes([AllowAny])
    def get_general(request):
        general_tags = InterestTags.objects.all() #exclude all tags who's parents are NOT null
        serialized_tag = TagSerializer(general_tags, many=True)

        return JsonResponse({'tags' : serialized_tag.data})
    @api_view(['POST'])
    def tag_names(request):
        ids = request.data.get('tags')
        names = []
        for i in ids:
            names.append(TagSerializer(InterestTags.objects.get(id=i)).data)
        return Response(names)

    
    @api_view(['DELETE'])
    @permission_classes([AllowAny])
    def delete_gen_tag(request):
        tag_name = request.data.get('interest_tag_name')

        current_user = request.user.id
        if tag_name.get('interest_tag_name').exists() :
            updated_user = UserProfileInfo.objects.get(id=current_user).interesttags_set.all().filter(interest_tag_name=tag_name).delete()
            updated_serialized = AccountSerializer(data=updated_user)

        else: 
            return Response('You do not have any tag to delete')

        return Response(updated_serialized.data)


#This is a general interest MPTT management
class InterestsManagement(generics.UpdateAPIView):
    serializer_class = InterestSerializer
    queryset = Interests.objects.all()
    permission_classes = [IsAuthenticated, permissions.ReadOnly]
    #return parent interests based off of no parent id
    def get(self, request):
        parent_interests = Interests.objects.exclude(parent_id__isnull=False)
        parents_json = InterestSerializer(parent_interests, many=True)

        return JsonResponse({'parent_interests': parents_json.data}) #reprogram to return parent interests
    #return child interests
    def get_children(self):
        child_interests = Interests.objects.exclude(parent_id__isnull=True)
        child_json = InterestSerializer(data=child_interests)

        return JsonResponse({'child_interests': child_json.data}) #reprogram to return child interests
        
    #update parent interests 
    #NOTE: this is not duplicate-proof, will have to make an "already exists" later
    #update parent and child are separate to allow for better control over what happens
    def patch(self, request):
        interest_data = request.data

        if interest_data.get('parent') is not None:
            return Response('this is not a sub interest')
        
        if interest_data.get('role') == 'SI':
            return Response('that is not a role for parent interest!')

        serialized_parent = InterestSerializer(data=request.data, partial=True)
        if serialized_parent.is_valid():
            serialized_parent.save()

            return JsonResponse({'updated_parent_interests' : serialized_parent.data})
        else:
            return JsonResponse({'error':serialized_parent.errors})
    #NOTE:
    #in order to test, put it in this format:
    #role : SI
    #interest_name : (insert child interest here)
    #parent : (insert parent ID here) do NOT insert parent name, has to be ID
    @api_view(['PATCH'])
    def update_child_interest(request):
        request_parent = request.data.get('parent')
        role_data = request.data.get('role')

        #it might be better to reorganize this into try except, but this will suffice for now
        if request_parent is None:
            
            return Response('This is not a parent interest!')

        if role_data == "MI":
        
            return Response('this is not a role for sub interests!')
        
        try:
            interestName = request.data.get('interest_name')
        
        except interestName is None:
            
            return Response('you must enter a name for interests!')
        #interest_data = Interests.objects.create(interest_name = interestName, role=role_data, parent=parentInterest)
        context = {
            'interest_name' : interestName, 
            'role' : role_data,
            'parent' : request_parent
        }

        serialized_interest = InterestSerializer(data=context, partial=True)
        if serialized_interest.is_valid():
            serialized_interest.save()

            return Response(serialized_interest.data)

        return Response(serialized_interest.errors)
