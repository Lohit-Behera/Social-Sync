from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer
from customuser.models import CustomUser as User

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_room(request):
    sender = request.user
    receiver_id = request.data.get('receiver_id')
    receiver = get_object_or_404(User, id=receiver_id)
    
    room_name = f"{min(sender.id, receiver.id)}_{max(sender.id, receiver.id)}"
    room, created = ChatRoom.objects.get_or_create(name=room_name)
    
    if created:
        room.participants.add(sender, receiver)
    
    serializer = ChatRoomSerializer(room)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, room_name):
    room = get_object_or_404(ChatRoom, name=room_name)
    messages = Message.objects.filter(room=room).order_by('timestamp')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)
