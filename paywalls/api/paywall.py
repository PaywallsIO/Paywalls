from typing import cast
from rest_framework import serializers, viewsets, mixins
from paywalls.models import Paywall
from paywalls.models.user import User

class PaywallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paywall
        fields = '__all__'
        read_only_fields = [
            'team'
        ]
    
    def create(self, validated_data: dict, *args, **kwargs) -> Paywall:
        user = self.context['request'].user
        team = user.team()
        paywall = Paywall.objects.create(
            name=validated_data['name'],
            team=team
        )
        return paywall

class PaywallViewSet(viewsets.ModelViewSet):
    queryset = Paywall.objects.all()
    serializer_class = PaywallSerializer