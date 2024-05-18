from django.contrib import admin
from .models import TextPost, Like, Share, Comment, CommentLike
# Register your models here.


admin.site.register(TextPost)
admin.site.register(Like)
admin.site.register(Share)
admin.site.register(Comment)
admin.site.register(CommentLike)