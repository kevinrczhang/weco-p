"""Core path Configuration

The `pathpatterns` list routes paths to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/paths/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a path to pathpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a path to pathpatterns:  path('', Home.as_view(), name='home')
Including another pathconf
    1. Import the include() function: from django.paths import include, path
    2. Add a path to pathpatterns:  path('blog/', include('blog.paths'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt import views as jwt_views
#any problems, refer to settings.py, way bottom for potential fixes
urlpatterns = [
    path('admin/', admin.site.urls),
    path('posts/',include('posts.urls')),
    path('accounts/',include('accounts.urls')),
    path('notifications/', include('notifications.urls')),

]+ static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)