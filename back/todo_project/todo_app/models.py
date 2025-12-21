from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import Group
from django.contrib.auth.models import Permission
from django.db.models import Q

#Teachers - any_schedule, can_delete
#Students - my_schedule
#Admin - any_schedule, can_delete

#can_delete - delete_ImageViewSet


class Category(models.Model):
    name = models.CharField(max_length=100)

class Priority(models.Model):
    level = models.CharField(max_length=100)

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    id = models.AutoField(primary_key=True)

    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)

    completed = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['id'], name="taskindex") #Btree index
        ]


class FileUpload(models.Model):
    file = models.CharField(max_length=200)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

def upload_to(instance, filename):
    return '/'.join(['images', str(instance.name), filename])

class UploadImageTest(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to=upload_to, blank=True, null=True)
    likes = models.IntegerField(default=0)

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="likes")
    picture = models.ForeignKey(
        UploadImageTest,
        on_delete=models.CASCADE,
        related_name="picture_likes"
    )
    like = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'picture')

class Profile(models.Model):
    pic = models.ForeignKey(UploadImageTest, on_delete=models.CASCADE, related_name="pfp", default="http://localhost:8000/media/images/13/8888.png")
    nickname = models.TextField(max_length=35)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
    desc = models.TextField(default="No desc.", max_length=222)

class Schedule(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    json = models.JSONField()

class BlockList(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blocked_by")
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blocked")
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user1', 'user2'], name='unique_user_block_pair')
        ]
        indexes = [
            models.Index(fields=['user1', 'user2'], name="blocklistindex") #Btree index
        ]

class Messages(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recipient")
    content = models.TextField(max_length=750)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.user1} -> {self.user2}: {self.content[:30]}"

    @classmethod
    def get_user_dialogs(cls, user_id):
        return User.objects.filter(
            Q(sender__user2_id=user_id) | Q(recipient__user1_id=user_id)
        ).distinct()

    @classmethod
    def get_conversation(cls, user1_id, user2_id):
        return cls.objects.filter(
            Q(user1_id=user1_id, user2_id=user2_id)
            | Q(user1_id=user2_id, user2_id=user1_id)
        ).order_by("created_at")
    
    class Meta:
        indexes = [
            models.Index(fields=['user1', 'user2'], name="messagesindex") #Btree index
        ]
