from rest_framework import serializers
import copy
from posts.models import Post, Comment, CategoryMptt, Tags, Likes, PostReport, Reply
from accounts.models import UserProfileInfo
#from rest_framework_recursive.fields import RecursiveField

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['id']
class PostReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostReport
        fields = '__all__'

class LikesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Likes
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
class ReplySerializer(serializers.ModelSerializer):
    class meta:
        model = Reply
        fields = '__all__'
    def to_representation(self, instance):
        data = super().to_representation(instance)
        comment_id = copy.deepcopy(data.get('comment'))
        author = copy.deepcopy(data.get('author'))
        data['comment'] = CommentSerializer(Comment.objects.get(id=comment_id))
        data['author'] = UserProfileInfo.objects.get(id=author).username
        data['author_id'] = UserProfileInfo.objects.get(id=author).id
        return data
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryMptt
        fields = 'category_name', 'id'
        read_only_fields = ['__all__']

class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = '__all__'

class ImageSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Post
        fields = ('id', 'image')
        read_only_fields = ['id']