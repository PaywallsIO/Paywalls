from rest_framework import serializers
from paywalls.models.team import Team
from typing import Optional

class TeamSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Team
        
        fields = [
            'id',
            'name'
        ]

    def get_name(self, instance: Team) -> Optional[str]:
        return instance.name if instance.name else "Default Team"