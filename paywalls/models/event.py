from django.db import models
from django.utils import timezone
from paywalls.models import (
    TimeStampedModel,
    Team
)
import uuid

class Event(models.Model):
    class Meta:
        indexes = [
            models.Index(fields=["timestamp", "team_id", "event_name"])
        ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event_name: models.CharField = models.CharField(max_length=200, null=True, blank=True)
    team: models.ForeignKey = models.ForeignKey(Team, on_delete=models.CASCADE)
    parameters: models.JSONField = models.JSONField(default=dict)
    timestamp: models.DateTimeField = models.DateTimeField(default=timezone.now, blank=True) # the dt the event occured. Supplied by clients
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True, null=True, blank=True) # the dt the event was inserted