from django.urls import include, path
from posts import views
from rest_framework.routers import DefaultRouter
#from .router import router
app_name = 'posts'

router = DefaultRouter()
router.register('post-view-set', views.PostViewSet, basename='post-view-set')
router.register('cat-view-set', views.CategoryViewSet, basename='cat-view-set')
router.register('tags-view-set', views.TagsViewSet, basename='tags-view-set')
router.register('comment-view-set', views.CommentViewSet, basename='comment-view-set')
router.register('likes-view-set', views.LikesViewSet, basename='likes-view-set')
router.register('recommended', views.RecPostViewSet, basename='rec-post-view-set')


urlpatterns = [
    path('about/',views.AboutView.as_view() ,name='about'),
    path('', include(router.urls)),
    path('following_posts/', views.PostViewSet.get_following_posts), 
    path('drafts/', views.DraftListView.as_view(), name='post_draft_list'),
    path('create_p/', views.CreatePostView.create_p_category, name='create_parent'),
    path('report/', views.ReportPost.as_view())
    # path('posts.views/', include(router.urls)),
]
