from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import TextPost
from .serializers import TextPostSerializer
from customuser.models import CustomUser
from customuser.serializers import PostUserDetailSerializer

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
        user_serializer = PostUserDetailSerializer(user, many=False)
        serializer = TextPostSerializer(text_post, many=False)
        return Response({'post': serializer.data, 'user' : user_serializer.data})
    except Exception as e:
        print(e)
        return Response({'message': 'An error occurred while processing your request'}, status=status.HTTP_400_BAD_REQUEST)