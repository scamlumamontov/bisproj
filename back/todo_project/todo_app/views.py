from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from .models import Task, FileUpload, Like, Profile
from .serializers import TaskSerializer, FileUploadSerializer
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework import mixins
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework import serializers
from .models import UploadImageTest, User, Profile, Messages, BlockList, Schedule
from django.http import HttpResponse
from rest_framework.generics import ListAPIView
from rest_framework import permissions
import json
from .permissions import IsOwnerOrReadOnly
from django.db.models import Q
from django.utils import timezone
from rest_framework.permissions import DjangoModelPermissions
from rest_framework.generics import CreateAPIView
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from .models import Schedule
from .serializers import ScheduleSerializer
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from .serializers import *

class ImageWork(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView
):
    queryset = UploadImageTest.objects.all()
    permission_classes = [
        IsAuthenticated,
        DjangoModelPermissions,
    ]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ImageUploadSerializer
        return ImageSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get(self, request, *args, **kwargs):
        if 'pk' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

class ScheduleListCreateView(ListCreateAPIView):
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def get_queryset(self):
        return Schedule.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ScheduleDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def get_queryset(self):
        return Schedule.objects.filter(user=self.request.user)



class TaskListView(ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def get_queryset(self):
        now = timezone.now()
        Task.objects.filter(
            end_time__lte=now,
            completed=False
        ).update(completed=True)
        return super().get_queryset()

class TaskCreateView(CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request, pk):
    tasks = Task.objects.filter(user=pk)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

class TaskDetailView(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    lookup_field = 'pk'
    http_method_names = ['get', 'put', 'delete']



    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
    

class FileUploadView(CreateAPIView):
    queryset = FileUpload.objects.all()
    serializer_class = FileUploadSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['GET'])
class FileListView(APIView):
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def get(self, request):
        files = FileUpload.objects.filter(user=request.user)
        serializer = FileUploadSerializer(files, many=True)
        return Response(serializer.data)


class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadImageTest
        fields = ('id', 'name', 'image')

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadImageTest
        fields = ('id', 'name', 'image', 'likes')

class ImageViewSet(ListAPIView):
    queryset = UploadImageTest.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ImageUploadSerializer
        return ImageSerializer

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs): #Send get query to retrieve all
        file = request.data['image']
        name = request.data.get('name', '')
        image = UploadImageTest.objects.create(name=name, image=file)
        return HttpResponse(json.dumps({'message': "Uploaded"}), status=200)
    
    def get(self, request, *args, **kwargs):
        image_id = kwargs.get('pk')
        if image_id:
            try:
                image = UploadImageTest.objects.get(pk=image_id)
                serializer = ImageSerializer(image)
                return Response(serializer.data)
            except UploadImageTest.DoesNotExist:
                return Response({'error': 'Not found'}, status=404)
        return super().get(request, *args, **kwargs)
    
class LikePictureView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            picture = UploadImageTest.objects.get(pk=pk)
        except UploadImageTest.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        like, created = Like.objects.get_or_create(user=request.user, picture=picture)
        if not created:
            like.delete()
            picture.likes = max(picture.likes - 1, 0)
            picture.save(update_fields=["likes"])
            return Response({"detail": "Unliked", "likes": picture.likes})

        picture.likes += 1
        picture.save(update_fields=["likes"])
        return Response({"detail": "Liked", "likes": picture.likes})
    

class MyLikedPicturesView(generics.ListAPIView):
    serializer_class = ImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UploadImageTest.objects.filter(
            picture_likes__user=self.request.user
        ).distinct()

class LikeStatusView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get(self, request, pk):
        picture = get_object_or_404(UploadImageTest, pk=pk)
        liked = Like.objects.filter(user=request.user, picture=picture).exists()
        likes_count = Like.objects.filter(picture=picture).count()

        return Response({
            "liked": liked,
            "likes": likes_count
        })

class ProfileSerializer(serializers.ModelSerializer):
    pic = serializers.PrimaryKeyRelatedField(queryset=UploadImageTest.objects.all())
    user = serializers.PrimaryKeyRelatedField(read_only=True)  # безопасно: user ставим из request
    class Meta:
        model = Profile
        fields = ['id', 'pic', 'nickname', 'user', 'desc']
        read_only_fields = ['id', 'user']

class ProfileRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsOwnerOrReadOnly, IsAuthenticated]
    http_method_names = ['get', 'put', 'patch'] 

class ProfileListAPIView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_request_id(request):
    return Response({'id': request.user.id})

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']



@api_view(['GET'])
def get_schedule(request):
    permission_classes = [IsAuthenticated]
    try:
        schedule = Schedule.objects.get(user=request.user)
        return JsonResponse(schedule.json, safe=False)
    except Schedule.DoesNotExist:
        return JsonResponse(
            {"error": "Schedule not found"},
            status=404
        )

class MessageSerializer(serializers.ModelSerializer):
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)

    class Meta:
        model = Messages
        fields = ['id', 'user1', 'user2', 'content', 'created_at']

@api_view(['GET'])
def get_dialogs(request, user_id):
    users = User.objects.filter(
        Q(sender__user2_id=user_id) | Q(recipient__user1_id=user_id)
    ).distinct()

    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_messages(request, user1_id, user2_id):
    messages = Messages.objects.filter(
        Q(user1_id=user1_id, user2_id=user2_id)
        | Q(user1_id=user2_id, user2_id=user1_id)
    ).order_by("created_at")

    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def send_message(request):
    user1_id = request.data.get("user1")
    user2_id = request.data.get("user2")
    content = request.data.get("content")

    if not all([user1_id, user2_id, content]):
        return Response(
            {"error": "Не хватает данных"}, status=status.HTTP_400_BAD_REQUEST
        )

    # Check for blocklist
    if BlockList.objects.filter(user1_id=user1_id, user2_id=user2_id).exists():
        return Response(
            {"error": "Вы заблокировали этого пользователя"},
            status=status.HTTP_403_FORBIDDEN
        )

    if BlockList.objects.filter(user1_id=user2_id, user2_id=user1_id).exists():
        return Response(
            {"error": "Вы находитесь в блоклисте пользователя"},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        user1 = User.objects.get(id=user1_id)
        user2 = User.objects.get(id=user2_id)
    except User.DoesNotExist:
        return Response({"error": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND)

    message = Messages.objects.create(user1=user1, user2=user2, content=content)
    serializer = MessageSerializer(message)

    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(["POST"])
def toggle_block(request, user1, user2):
    if user1 == user2:
        return Response({"error": "Нельзя заблокировать самого себя"}, status=400)

    try:
        obj = BlockList.objects.get(user1_id=user1, user2_id=user2)
        obj.delete()
        return Response({"blocked": False}, status=200)
    except BlockList.DoesNotExist:
        BlockList.objects.create(user1_id=user1, user2_id=user2)
        return Response({"blocked": True}, status=201)


@api_view(["GET"])
def is_blocked(request, user1, user2):
    exists = BlockList.objects.filter(user1_id=user1, user2_id=user2).exists()
    return Response({"blocked": exists})