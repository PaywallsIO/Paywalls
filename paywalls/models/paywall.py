from django.db import models
from paywalls.models import (
    TimeStampedModel,
    Team
)

class Paywall(TimeStampedModel):
    team: models.ForeignKey = models.ForeignKey(Team, on_delete=models.CASCADE)
    content: models.JSONField = models.JSONField(default=dict)