from accounts.views import UserDetailAPIView
from django.conf.urls import url, include
from django.contrib.auth import views as auth_views
from accounts import views
from django.urls import include, path
from rest_framework import routers
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from accounts.views import RegisterApi
from rest_framework_simplejwt import views as jwt_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
app_name = 'accounts'

router = DefaultRouter()
router.register('profile', views.UserListViewset)
#router.register('users_interests', views.GetUserByInterest.get_user_by_interest)
#router.register('users_tags', views.GetUserByInterest.get_user_by_tag)

urlpatterns = [
   
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
    #path('edit_profile/', views.upload_pic, name = 'image_upload'),
    #path('browse', views.display_all_users, name = 'browse'),
    path('', include(router.urls)),
    path('parent_interests/', views.InterestsManagement.as_view(), name="get_parent_interests"),
    path('child_interests/', views.InterestsManagement.get_children, name="get_child_interests"),
    path('update_child/', views.InterestsManagement.update_child_interest, name="update_child_interests"),
    path('create_interest/', views.InterestsManagement.as_view(), name="update_child_interests"),
    path('register', RegisterApi.as_view()),
    path('match/', views.Match.as_view(), name="interest_match"),
    path('quick_match/',views.Match.match_without_location),
    path('location/', views.Match.return_location_matched, name="interest_match"),
    path('create_gen/', views.TagManagement.create_gen_tags, name="create_gen_tag"),
    path('tags_list/', views.TagManagement.get_general, name="get_tags"),
    path('tag_names/', views.TagManagement.tag_names),
    path('interest_list/', views.InterestList.as_view({'get': 'list'})),
    path('login/', views.LoginView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('details/<int:pk>/', UserDetailAPIView.as_view(), name='user_profile'),
    path('self/', UserDetailAPIView.get_self), #NOTE: This url should be used for all urls where you don't want to expose the user's email to the public
    path('user_id/', UserDetailAPIView.get_current_user_id),
    path('your_posts/<int:pk>/', UserDetailAPIView.get_all_posts, name="get_c_user_posts"),
    path('follow/', views.Follow.as_view(), name="follow_user"),
    path('unfollow/', views.Follow.unfollow, name='unfollow_user'),
    path('is_following', views.Follow.is_following, name='is_following_user'),
    path('following/', views.Follow.get_following),
    path('followers/', views.Follow.get_followers),
    path('interest_names/', views.InterestList.get_names),
    path('search_users', views.UserListViewset.as_view({'get' : 'list'}), name="search_for_users"),
    path('following_post/', views.Follow.following_posts),
    path('notif', views.UserDetailAPIView.notif),
    #path('test', views.test) #NOTE: make sure this is commented out during production!!!
    # path('users/', views.UserListViewset.as_view({'get': 'list'})),
    #login
    #LOGIN_URL = '/accounts/login/'
]
