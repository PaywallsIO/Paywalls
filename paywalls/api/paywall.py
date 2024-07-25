from typing import cast
from rest_framework import serializers, viewsets, mixins
from paywalls.models import Paywall
from paywalls.models.user import User
from paywalls.exceptions import Conflict
from django.db import transaction
from django.utils.timezone import now

class PaywallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paywall
        fields = [
            "id",
            "name",
            "content",
            "version",
            "deleted_at",
            "created_at",
            "created_by",
            "last_modified_at",
            "last_modified_by",
        ]
        read_only_fields = [
            "id",
            "deleted_at",
            "created_at",
            "created_by",
            "last_modified_at",
            "last_modified_by",
        ]
    
    def create(self, validated_data: dict, *args, **kwargs) -> Paywall:
        user = self.context['request'].user
        team = user.team()
        paywall = Paywall.objects.create(
            name=validated_data['name'],
            created_by=user,
            team=team,
            last_modified_by=user,
            **validated_data
        )
        return paywall
    
    def update(self, instance: Paywall, validated_data: dict, *args, **kwargs) -> Paywall:
        print(validated_data)
        with transaction.atomic():
            # select_for_update locks the database row so we ensure version updates are atomic
            locked_instance = Paywall.objects.select_for_update().get(pk=instance.pk)

            if validated_data.keys():
                locked_instance.last_modified_at = now()
                locked_instance.last_modified_by = self.context["request"].user

                if validated_data.get("content"):
                    if validated_data.get("version") != locked_instance.version:
                        raise Conflict("Paywall edited by someone else")

                    validated_data["version"] = locked_instance.version + 1

                updated_paywall = super().update(locked_instance, validated_data)

        return updated_paywall

class PaywallViewSet(viewsets.ModelViewSet):
    queryset = Paywall.objects.all()
    serializer_class = PaywallSerializer