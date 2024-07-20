from typing import cast
from rest_framework import serializers, viewsets, mixins, exceptions
from paywalls.models import User
from rest_framework.permissions import IsAuthenticated

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'is_active',
            'is_staff',
            'date_joined',
            'last_login'
        ]

        extra_kwargs = {
            'password': {'write_only': True}
        }

class UserViewSet(
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    queryset = User.objects.filter(is_active=True)
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        lookup_value = self.kwargs[self.lookup_field]
        user = cast(User, self.request.user)
        if lookup_value == "@me":
            return user

        if not user.is_staff:
            raise exceptions.PermissionDenied()

        return super().get_object()