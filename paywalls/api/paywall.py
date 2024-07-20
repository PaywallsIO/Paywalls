from typing import cast
from rest_framework import serializers, viewsets, mixins
from paywalls.models import Paywall

class PaywallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paywall
        fields = '__all__'

class PaywallViewSet(viewsets.ModelViewSet):
    queryset = Paywall.objects.all()
    serializer_class = PaywallSerializer