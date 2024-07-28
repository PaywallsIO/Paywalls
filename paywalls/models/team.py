from django.db import models
from django.dispatch import receiver
from paywalls.models import (
    TimeStampedModel,
    User
)
import secrets

class Team(TimeStampedModel):
    name: models.CharField = models.CharField(max_length=200, null=True)
    users: models.ManyToManyField = models.ManyToManyField(User, blank=True)
    api_token: models.CharField = models.CharField(max_length=200, null=True, blank=True)

@receiver(models.signals.post_save, sender=Team)
def create_api_token(sender, instance, created, **kwargs):
    if created and not settings.DEBUG and not instance.api_token:
        instance.api_token = secrets.token_urlsafe(64)
        instance.save()