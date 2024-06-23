from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import TextPost, Like, Comment
from .serializers import TextPostSerializer, CommentSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_text_post(request):
    try:
        data = request.data
        user = request.user

        text_post = TextPost.objects.create(
            user=user,
            content=data['content']
        )

        serializer = TextPostSerializer(text_post, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_text_post(request,pk):
    try:
        text_post = TextPost.objects.get(id=pk)
        likes_count = Like.objects.filter(post=text_post.id).count()
        text_post.total_likes = likes_count
        text_post.save()
        serializer = TextPostSerializer(text_post, many=False)
        return Response(serializer.data)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_unlike_post(request, pk):
    try:
        user = request.user
        post = get_object_or_404(TextPost, id=pk)

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
        posts = TextPost.objects.all().order_by('-created_at')
        serializer = TextPostSerializer(posts, many=True)
        return Response(serializer.data)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_posts(request, pk):
    try:
        post = TextPost.objects.filter(user=pk)
        serializer = TextPostSerializer(post, many=True)
        return Response(serializer.data)
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_text_post(request, pk):
    try:
        post = TextPost.objects.get(id=pk)
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
def delete_text_post(request, pk):
    try:
        post = TextPost.objects.get(id=pk)
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
        post = TextPost.objects.get(id=pk)
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