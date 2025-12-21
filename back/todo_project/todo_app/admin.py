from django.contrib import admin
from .models import Task, UploadImageTest
from .models import BlockList, Messages, Profile, Schedule, Like
admin.site.register(BlockList)
admin.site.register(Messages)
admin.site.register(Profile)
admin.site.register(Schedule)
admin.site.register(Task)
admin.site.register(UploadImageTest)
admin.site.register(Like)