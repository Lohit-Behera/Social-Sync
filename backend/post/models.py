from django.db import models
import uuid
# Create your models here.

class TextPost(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField(null=False, blank=False)
    likes = models.IntegerField(default=0)
    comments = models.IntegerField(default=0)
    shares = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey('customuser.CustomUser', on_delete=models.CASCADE, related_name='text_posts')

    def __str__(self):
        return self.content
    
class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField(null=False, blank=False)
    likes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey('customuser.CustomUser', on_delete=models.CASCADE, related_name='user_comments')
    post = models.ForeignKey('post.TextPost', on_delete=models.CASCADE, related_name='post_comments')

    def __str__(self):
        return self.content