from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Post, Like, Comment
from .serializers import PostSerializer, CommentSerializer

from PIL import Image

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    try:
        data = request.data
        user = request.user
        if data['type'] == 'text':
            post = Post.objects.create(
                user=user,
                content=data['content'],
                type=data['type']
            )
            
        if data['type'] == 'image':
            post = Post.objects.create(
                user=user,
                image=data['image'],
                content=data['content'],
                type=data['type']
            )
            
        if data['type'] == 'video':
            post = Post.objects.create(
                user=user,
                video=data['video'],
                content=data['content'],
                type=data['type']
            )

        serializer = PostSerializer(post, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_post(request,pk):
    try:
        post = Post.objects.get(id=pk)
        likes_count = Like.objects.filter(post=post.id).count()
        comment_count = Comment.objects.filter(post=post.id).count()
        post.total_likes = likes_count
        post.total_comments = comment_count
        post.save()
        serializer = PostSerializer(post, many=False)
        return Response(serializer.data)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_unlike_post(request, pk):
    try:
        user = request.user
        post = get_object_or_404(Post, id=pk)

        like_obj, created = Like.objects.get_or_create(user=user, post=post)

        if not created:
            like_obj.delete()
            return Response({'message': 'Post unliked'}, status=status.HTTP_200_OK)
        else:
            like_obj.like = True
            like_obj.save()
            return Response({'message': 'Post liked'}, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_text_posts(request):
    try:
        posts = Post.objects.filter(type='text').order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_posts(request, pk):
    try:
        post = Post.objects.filter(user=pk)
        serializer = PostSerializer(post, many=True)
        return Response(serializer.data)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_text_post(request, pk):
    try:
        post = Post.objects.get(id=pk)
        data = request.data
        post.content = data['content']
        post.updated_at = timezone.now()
        post.edited = True
        post.save()
        return Response({'message': 'Post updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request, pk):
    try:
        post = Post.objects.get(id=pk)
        
        if post.type == 'image':
            post.image.delete()
        if post.type == 'video':
            post.video.delete()
        
        post.delete()
        return Response({'message': 'Post deleted successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)

    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def create_comment(request, pk):
    try:
        user = request.user
        post = Post.objects.get(id=pk)
        data = request.data
        
        comment = Comment.objects.create(
            user=user,
            post=post,
            content=data['content']
        )
        return Response({'message': 'Comment created successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_comments(request, pk):
    try:
        comments = Comment.objects.filter(post=pk).order_by('-created_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_comment(request, pk):
    try:
        comment = Comment.objects.get(id=pk)
        comment.delete()
        return Response({'message': 'Comment deleted successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_comment(request, pk):
    try:
        comment = Comment.objects.get(id=pk)
        data = request.data
        comment.content = data['content']
        comment.save()
        return Response({'message': 'Comment updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_video_posts(request):
    video_posts = Post.objects.filter(type='video').order_by('-created_at')
    serializer = PostSerializer(video_posts, many=True)
    return Response(serializer.data)
    