from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from posts.models import Post, Comment, CategoryMptt, Tags, Likes, PostReport, Reply
from accounts.models import Interests, UserProfileInfo, UserFollowing
from django.utils import timezone
from posts.forms import PostForm, CommentForm
from posts.serializer import PostSerializer, CommentSerializer, ImageSerializer, CategorySerializer, TagsSerializer, LikesSerializer, PostReportSerializer, ReplySerializer
from django.template.defaultfilters import slugify
from datetime import datetime
from django.views.generic import (TemplateView,ListView,
                                  DetailView,CreateView,
                                  UpdateView,DeleteView)

from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from rest_framework import generics, viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from rest_framework.views import APIView
from better_profanity import profanity
from accounts.serializers import AccountSerializer
from accounts.views import ReturnIntNames, ReturnTagNames
from notifications.models import Notification
from notifications.serializers import NotificationSerializer
import copy
class AboutView(TemplateView):
    template_name = 'posts/about.html'

#just going to go with a classic apiview for this one, as for the create category, 
#there should exist a permission for admins only to create
class CreatePostView(APIView):
    
    #for parent category 
    def create_p_category(self, request, format=None):
        cat_data = request.data
        parent = cat_data.get('parent')
        if parent is not None:
            return Response('parent category cannot have a parent')
        if CategoryMptt.objects.filter(parent=parent).filter(category_name=cat_data.get('category_name')).exists():
                return Response('this category already exists!')
        
        if cat_data.get('role') == 'SI':
            return Response('Must be MI')

        serialized_parent = CategorySerializer(data=cat_data, partial=True)
        if serialized_parent.is_valid():
            serialized_parent.save()

            return JsonResponse({'updated_parent_interests' : serialized_parent.data})
        else:
            return JsonResponse({'error':serialized_parent.errors})
    
    def create_s_category(self, request, format=None):
        cat_data = request.data

        if cat_data.get('parent') is None:
            return Response('there must be a parent for this')
            if cat_data.get('parent').DoesNotExist:
                return Response('this parent does not exist!')
        
        if cat_data.get('role') == 'MI':
            return Response('Must be Si')

        serialized_child = CategorySerializer(data=cat_data, partial=True)
        if serialized_child.is_valid():
            serialized_child.save()

            return JsonResponse({'updated_child_interests' : serialized_child.data})
        else:
            return JsonResponse({'error':serialized_child.errors})
def return_queryset(request):
    queryset = infinite_filter(request)
    return queryset

def infinite_filter(request):
    limit = request.GET.get('l')
    offset = request.GET.get('o')
    
    if limit and offset:
        return Post.objects.all()[:int(offset) + int(limit)]
    elif limit:
        return Post.objects.all()[:int(limit)]
    else:
        return Post.objects.all()[:15]

    return Post.objects.all()[:40]

#def rec_infinite_filter(request): #infinite filter for recommended post list, todo later
#infinite filter for follow post list
def has_more_data(request):
    o = request.GET.get('o')
    l = request.GET.get('l')

    if o and l:
        return Post.objects.all().count() > int(request.GET.get('o')) + int(request.GET.get('l'))
    else: 
        return Response('either offset or limit is missing')



def tag_names():
    tags = []
    tags = Tags.objects.all().values_list('tag_name', flat=True)

    return tags

def cat_names():
    categories = []  
    categories = CategoryMptt.objects.all().values_list('category_name', flat=True)
    
    return categories
#get name of tags and categories from both post and user, then return a set of posts that overlap the interest and 
#tag name of the user

class RecPostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    passed = []
    once = False
    tags = False
    categories = False
    def list(self, request, *args):
        #get cat + tags for posts, then tags + interests for user, should return list from each function
        limit = request.GET.get('l')
        offset = request.GET.get('o')
        passed = self.passed#should be a list of post ids
        got_once = self.once
        final_posts = []
        if limit and offset:
            categories = cat_names()
            tags = tag_names() 
            user_interests = ReturnIntNames(self.request._request)
            user_tags = ReturnTagNames(self.request._request)
            #category to interests
            interests_filter = filter(lambda x: any(x == t for t in categories), user_interests)   
            tags_filter = filter(lambda x: any(x == t for t in tags), user_tags)
        
        else:
            return Response('Either limit or offset was not provided!')
        if not got_once:
            got_once = True
            passed = request.data.get('posts')

        if args:
            passed = copy.deepcopy(args[0])
            final_posts.extend(args[1])

        raw_posts = []
        j = 0
        i = 0
        length = 0
        once = False
        interests_list = list(interests_filter)
        tags_list = list(tags_filter)
        #return Response(PostSerializer(Post.objects.filter(category__category_name=interests_list[0])[0]).data)
        #return Response(interests_list[0])
        queryset = None
        if self.categories:
            while i < len(interests_list) or j < length:#increment through interest only if j reaches the length, which is the number of posts we are saving into raw_posts
                if once == False:#so that we only get all posts once 
                    #can consider limiting queryset after we've created a final_posts list later on
                    temp = Post.objects.filter(category__category_name=interests_list[i]).order_by('?')[:int(offset) + int(limit)] #add limit and offset code here for infinite filter
                    #return Response(PostSerializer(temp, many=True).data) 
                    once = True
                    length = temp.count()
                    if request.data.get('posts'): #should be list of post ids
                        if passed:
                            limit2 = limit - len(passed)
                            temp = Post.objects.filter(category__category_name=interests_list[i]).order_by('?').exclude(id__in=passed)[:int(offset) + int(limit2)]
                            if temp.count() < 100:
                                self.categories = False
                            queryset = temp
                            length = temp.count()
                #Check if there are posts    
                if length != 0 and interests_list[i][j]: 
                    raw_posts.append(queryset.filter(category__category_name=interests_list[i])[j]) #append first value of this list
                    
                    #and then increment index by one 
                    j += 1
                #if not, then move onto the next interest and reset everything
                else:
                    i += 1
                    once = False
                    length = 0
                    continue

                if j == length : #reset everything and increment i by 1
                    i+=1
                    j = 0
                    length = 0
                    once = False
            #return Response(PostSerializer(raw_posts, many=True).data)
            j = 0
            i = 0
            length = 0
            once = False
        #return Response(Post.objects.filter(tags__tag_name=tags_list[1])[0] not in raw_posts)
        if self.tags:
            while i < len(tags_list) or j < length:
                if once == False:
                    temp = Post.objects.filter(tags__tag_name=tags_list[i]).order_by('?')[:int(offset) + int(limit)]
                    once = True
                    length = temp.count()
                    if passed:
                        limit2 = limit - len(passed)
                        temp = Post.objects.filter(tags__tag_name=tags_list[i]).order_by('?').exclude(id__in=passed)[:int(offset) + int(limit2)]
                        if temp.count() < 100:
                            self.tags = False
                        queryset = temp
                        length = temp.count()
                #Check if there are posts    
                if length != 0 and tags_list[i][j]: 
                    if Post.objects.filter(tags__tag_name=tags_list[i])[j] not in raw_posts:
                        raw_posts.append(queryset.filter(tags__tag_name=tags_list[i])[j]) #append first value of this list
                        #and then increment index by one 
                        j += 1
                        
                    else: 
                        j+=1
                        #if there's only one value in temp, then reset everything and increment i by 1
                        if j == length: #reset everything and increment i by 1
                            i+=1
                            j = 0
                            length = 0
                            once = False
                            continue

                else:
                    i += 1
                    once = False
                    length = 0
                    continue

                if j == length: 
                    i+=1
                    j = 0
                    length = 0
                    once = False

        #check for any duplicate posts, remove if so 
        for post in raw_posts: #to remove duplicate dictionaries from list
            if post not in final_posts:
                final_posts.append(post)
        if request.data.get('posts'):
            length = len(final_posts) + len(passed)
            if self.tags or self.categories: #just to prevent infinite recursion in the event there are less than 100 existing posts
                if length < limit: #not enough posts that matched
                    passed.extend(final_posts.values_list('id', flat=True))
                    self.list(request, passed, final_posts)
        serialized_data = PostSerializer(final_posts, many=True).data
        return Response({
            "posts" : serialized_data
        })

class ReportPost(APIView):
    def post(self, request):
        user = request.user
        post = Post.objects.get(id=request.data.get('post'))
        reason = request.data.get('reason')
        if PostReport.objects.get(post=post, user=request.user, reason=reason).exists():
            return Response("Report has already been made")
        report = PostReport.objects.create(post=post, user=request.user, reason=reason)
        existing_reports = post.postreport_set.all()
        most = {}
        for i in range(5):
            most[i - 1] = existing_reports.filter(reason=i-1).count()
        
        greatest = 0
        for value in most.values():
            if value > greatest:
                greatest = value
            
        if existing_reports.count() > 20:
            #filter reports by date later on
            post.delete()
            post.postreport_set.all().delete()
        if greatest > 10:
            #add reports by date later
            post.delete()
            post.postreport_set.all().delete()
        return Response(PostReportSerializer(report).data)
    def get(self, request):
        reasons = {
            0 : "Harassment or bullying",
            1 : 'Nudity',
            2 : "Misinformation or fake news",
            3 : "Harmful or dangerous acts",
            4 : "Violent or repulsive content"

        }
        return Response(reasons)

    
class PostViewSet(viewsets.ModelViewSet, LoginRequiredMixin):
      permission_classes = [AllowAny]
      serializer_class = PostSerializer
      queryset = Post.objects.filter(published_date__lte=timezone.now()).order_by('-published_date')

      def get__queryset1(self):
            queryset = infinite_filter(self.request)
            return queryset
      def get_queryset(self):
          return Post.objects.all()
      def create(self, request, format=None):
            #ONLY PNG FILES (No .jpg Files)#
            data = request.data.copy()
            data.pop('text')
            data.pop('title')
            raw_title = request.data.get('title')
            raw_text = request.data.get('text')
            filtered_text = profanity.censor(raw_text)
            filtered_title = profanity.censor(raw_title)
            data['text'] = filtered_text
            data['title'] = filtered_title
            
            serialized_data = PostSerializer(data=data)
            if serialized_data.is_valid():
                  serialized_data.save()
                  return Response(serialized_data.data)
            return Response(serialized_data.errors)

      @action(methods=['POST'], detail=True, url_path='image-upload') 
      def upload_image(self, request, pk=None):
            post = self.get_object()
            serializer = ImageSerializer(post, data=request.data)

            if serializer.is_valid():
                  serializer.save()
                  return Response(
                        serializer.data,
                        status=status.HTTP_200_OK
                  )
            return Response(
                  serializer.errors,
                  status=status.HTTP_400_BAD_REQUEST
            )

      def createPost(request):
            post = self.get_object()

      def list(self, request):
            if (request.GET.get('l') and request.GET.get('o')):
                posts = self.get__queryset1()
                serialized_data = PostSerializer(posts, many=True)
                return Response({
                            "posts" : serialized_data.data,
                            "more_data" : has_more_data(request)
                    })
            return Response('Either offset or limit was not provided!')
      
      def retrieve(self, request, pk):
            return Response(PostSerializer(Post.objects.get(id=pk)).data)
      @api_view(['GET'])
      def get_following_posts(request):
        if (request.GET.get('l') and request.GET.get('o')):
            posts = infinite_filter(request)
            serialized_data = PostSerializer(posts, many=True).data
        else:
            return Response('Either offset or limit was not provided!')
        user_params = request.GET.get('u')
        
        #based off the related_name in models
        user = UserProfileInfo.objects.get(id=user_params)
        following = user.following.all()#.values_list('id', flat=True)
        raw_follow = []
        for i in following:
            raw_follow.append(i.following_user_id.id)
        following_users = []
        following_users = filter(lambda x: any(x.get('author') == t for t in raw_follow), serialized_data)  

        return Response({
                "posts" : following_users,
                "more_data" : has_more_data(request)
        })

      @action(detail=True)   
      def cat_post_list(self, request, pk=None):
            category = self.get_object()
            post = Post.objects.filter(category_id=self.kwargs.get('pk'))
            post_json = PostSerializer(post, many=True)
            return Response(post_json.data)

      @action(detail=True)   
      def tags_post_list(self, request, slug, pk=None):
            tag = get_object_or_404(Tag, slug=slug)
            post = Post.objects.filter(tags=tag)
            post_json = PostSerializer(post, many=True)
            return Response(post_json.data)

class LikesViewSet(viewsets.ModelViewSet):
    queryset = Likes.objects.all()
    serializer_class = LikesSerializer

class TagsViewSet(viewsets.ModelViewSet):
    #queryset = Tags.objects.order_by('tag_name') #sorts alphabetically
    queryset = Tags.objects.all()
    serializer_class = TagsSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    #queryset = CategoryMptt.objects.order_by('category_name') #sorts alphabetically
    queryset = CategoryMptt.objects.all()
    serializer_class = CategorySerializer

class CommentViewSet(viewsets.ModelViewSet):
    # queryset = Comment.objects.filter(created_date__lte=timezone.now()).order_by('-created_date')
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    def create(self, request, validated_data):
        data = validated_data.data
        comment_author= UserProfileInfo.objects.get(id=data.get('author'))
        post = Post.objects.get(id=data.get('post'))
        copied = copy.deepcopy((data.get('text')))
        censored = profanity.censor(copied)

        if "*" in censored:
            return Response("This comment is not appropriate!")
        
        approved = False
        if data.get('approved_comment') == "true":
            approved = True

        comment = Comment.objects.create(text=data.get('text'), author=comment_author, post=post, approved_comment=approved)

        Notification.objects.create(title=comment_author.username+ " Has commented on your post!", text=data.get('text')[:50] + "...",
                                    receiver=comment_author, sender=request.user, post=post)
        comment_list = Comment.objects.all().filter(post=data.get('post'))
        serialized_list = CommentSerializer(comment_list, many=True).data
        
        for comment in serialized_list:
            user = UserProfileInfo.objects.get(id=comment['author']).username
            comment['username'] = user
        return Response(serialized_list)

    def list(self, request):
        post_id = request.GET.get('p')
        comments = CommentSerializer(Comment.objects.all().filter(post=post_id), many=True).data

        for comment in comments:
            user = UserProfileInfo.objects.get(id=comment['author']).username
            comment['username'] = user
        return Response(comments)

class Replies(APIView):
    queryset = Reply.objects.all()
    def get(self, request):
        comment = Comment.objects.get(id=request.data.get('comment'))
        replies = comment.replies.all()
        return Response(ReplySerializer(replies).data)

    def post(self, request):
        """
        data should contain comment id and text
        """
        data = request.data.copy()
        data.pop('text')
        data.pop('comment')
        comment = Comment.objects.get(id=request.data.get('comment'))
        text = request.data.get('text').copy()
        censored = profanity.censor(text)

        if "*" in censored:
            return Response('This reply is not appropriate!')

        data['text'] = censored
        data['comment'] = comment
        data['author'] = request.user
        reply = ReplySerializer(data=data)
        #input validation check
        if reply.is_valid():
            processed_reply = reply.save()
            return Response(processed_reply.data)
        return Response(processed_reply.errors)


#2022-02-27T02:09:15.321474Z
class DraftListView(LoginRequiredMixin,ListView):
    login_url = '/login/'
    redirect_field_name = 'posts/post_draft_list.html'

    model = Post

    def get_queryset(self):
        return Post.objects.filter(published_date__isnull=True).order_by('created_date')

#######################################
## Functions that require a pk match ##
#######################################

