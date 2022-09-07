from posts.views import PostViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register('posts', PostViewSet)

for url in router.urls:
    print(url, '\n')