from django.urls import path
from . import views, auth
from .views import LikePictureView, MyLikedPicturesView, LikeStatusView, get_request_id
from .views import ProfileRetrieveUpdateDestroyAPIView, toggle_block, is_blocked, ImageWork
from .views import TaskCreateView, TaskListView
from .views import (
    TaskCreateView,
    TaskListView,
    ScheduleListCreateView,
    ScheduleDetailView,
)
from .views import ScheduleListCreateView, ScheduleDetailView


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('tasks/', TaskListView.as_view()),
    path('tasks/create/', TaskCreateView.as_view()),
    path('tasks/<int:pk>/', views.TaskDetailView.as_view()),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('tasks/<int:pk>/user/', views.get_user),
    path('upload/', views.ImageViewSet.as_view(), name='upload'),
    path('pictures/<int:pk>/like/', LikePictureView.as_view(), name='picture-like'),
    path('pictures/mylikes/', MyLikedPicturesView.as_view(), name='my-liked-pictures'),
    path('pictures/<int:pk>/isliked/', LikeStatusView.as_view()),
    path('pictures/favourite', MyLikedPicturesView.as_view()),
    path('profile/<int:pk>', ProfileRetrieveUpdateDestroyAPIView.as_view()),
    path('profiles', views.ProfileListAPIView.as_view()),
    path('myid', get_request_id, name='id_from_token'),
    path('pictures/<int:pk>/', views.ImageViewSet.as_view()),
    path('dialogs/<int:user_id>/', views.get_dialogs, name='get_dialogs'),
    path('messages/<int:user1_id>/<int:user2_id>/', views.get_messages, name='get_messages'),
    path('messages/', views.send_message, name='send_message'),
    path('block/<int:user1>/<int:user2>/', toggle_block),
    path('isblocked/<int:user1>/<int:user2>/', is_blocked),
    path('schedule/', ScheduleListCreateView.as_view()),
    path('schedule/<int:pk>/', ScheduleDetailView.as_view()),
    path('pictures/<int:pk>/', ImageWork.as_view()),
]