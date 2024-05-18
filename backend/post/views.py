from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import TextPost, Like
from .serializers import TextPostSerializer
from customuser.models import CustomUser
from customuser.serializers import PostUserDetailSerializer
from django.shortcuts import get_object_or_404


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
        user = CustomUser.objects.get(id=text_post.user.id)
        likes_count = Like.objects.filter(post=text_post.id).count()
        text_post.total_likes = likes_count
        text_post.save()
        user_serializer = PostUserDetailSerializer(user, many=False)
        serializer = TextPostSerializer(text_post, many=False)
        return Response({'post': serializer.data, 'user' : user_serializer.data})
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