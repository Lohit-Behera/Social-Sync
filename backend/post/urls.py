from django.urls import path
from . import views

urlpatterns = [
    path('create/text/post/', views.create_text_post, name='create_text_post'),
    path('get/all/text/', views.get_text_posts, name='get_text_posts'),
    
    path('get/text/post/<str:pk>/', views.get_text_post, name='get_text_posts'),
    path('like/<str:pk>/', views.like_unlike_post, name='like_unlike_post'),
]