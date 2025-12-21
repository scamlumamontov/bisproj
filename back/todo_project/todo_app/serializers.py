from rest_framework import serializers
from .models import Task, Category, Priority, FileUpload
from django.contrib.auth.models import User
from .models import Schedule

class ScheduleSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Schedule
        fields = ['id', 'user', 'json']
        read_only_fields = ['id', 'user']


class TaskBasicSerializer(serializers.Serializer):
    title = serializers.CharField()
    completed = serializers.BooleanField()

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ('id',)

class FileUploadSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    file = serializers.CharField()
    uploaded_at = serializers.DateTimeField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)  # Removed `read_only=True`

    def create(self, validated_data):
        return FileUpload.objects.create(**validated_data)
    
from rest_framework import serializers
from .models import UploadImageTest

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadImageTest
        fields = ('id', 'name', 'image')
