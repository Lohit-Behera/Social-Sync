from rest_framework import serializers
from .models import TextPost, Comment

class TextPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextPost
        fields = '__all__'