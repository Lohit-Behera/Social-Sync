from django.urls import path
from . import views

urlpatterns = [
    path('room/', views.chat_room, name='room'),
    path('messages/<str:room_name>/', views.get_messages, name='messages'),
]