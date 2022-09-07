from django.contrib import admin
from mptt.admin import MPTTModelAdmin

# Register your models here.

from .models import Post, Comment, CategoryMptt, Tags

class CategoryMpttAdmin(MPTTModelAdmin):
  list_display = ('category_name', 'role')

class TagAdmin(admin.ModelAdmin):
  list_display = ('tag_name',)

admin.site.register(CategoryMptt, CategoryMpttAdmin)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Tags, TagAdmin)
