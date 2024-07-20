from django.db import models
from paywalls.models import (
    TimeStampedModel,
    Team
)

class Paywall(TimeStampedModel):
    name: models.CharField = models.CharField(max_length=255, null=True)
    team: models.ForeignKey = models.ForeignKey(Team, on_delete=models.CASCADE)
    content: models.JSONField = models.JSONField(default=dict)