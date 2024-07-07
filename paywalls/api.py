from rest_framework import routers #type: ignore
from rest_framework import serializers, viewsets #type: ignore
from django.http import HttpResponse, JsonResponse
from paywalls.models import Paywall, Team

class PaywallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paywall
        fields = '__all__'

class PaywallViewSet(viewsets.ModelViewSet):
    queryset = Paywall.objects.all()
    serializer_class = PaywallSerializer