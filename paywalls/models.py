from django.db import models
from django.db.models import JSONField
from django.conf import settings
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser

import secrets

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class User(AbstractUser):
    pass

class Team(TimeStampedModel):
    users: models.ManyToManyField = models.ManyToManyField(User, blank=True)
    api_token: models.CharField = models.CharField(max_length=200, null=True, blank=True)

@receiver(models.signals.post_save, sender=Team)
def create_api_token(sender, instance, created, **kwargs):
    if created and not settings.TEST and not instance.api_token:
        instance.api_token = secrets.token_urlsafe(64)
        instance.save()

class Paywall(TimeStampedModel):
    team: models.ForeignKey = models.ForeignKey(Team, on_delete=models.CASCADE)
    content: JSONField = JSONField(default=dict)