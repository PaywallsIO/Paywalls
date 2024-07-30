from django.db import models
from django.utils import timezone
from paywalls.models import (
    TimeStampedModel,
    Team,
    User
)

class Paywall(TimeStampedModel):
    name: models.CharField = models.CharField(max_length=255, null=True)
    team: models.ForeignKey = models.ForeignKey(Team, on_delete=models.CASCADE)
    content: models.JSONField = models.JSONField(default=dict)
    version: models.IntegerField = models.IntegerField(default=0)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True, blank=True)
    created_by: models.ForeignKey = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    deleted_at: models.DateTimeField = models.DateTimeField(null=True, blank=True)
    last_modified_at: models.DateTimeField = models.DateTimeField(default=timezone.now)
    last_modified_by: models.ForeignKey = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="modified_paywalls",
    )