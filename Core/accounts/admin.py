from django.contrib import admin
from mptt.admin import MPTTModelAdmin

# Register your models here.

from .models import Interests, InterestTags

class InterestsAdmin(MPTTModelAdmin):
  list_display = ('interest_name', 'role')

class InterestTagsAdmin(admin.ModelAdmin):
  list_display = ('interest_tag_name',)

admin.site.register(Interests, InterestsAdmin)
admin.site.register(InterestTags, InterestTagsAdmin)
