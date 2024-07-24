from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        credentials = {
            "email": attrs.get("email"),
            "password": attrs.get("password"),
        }

        user = authenticate(**credentials)

        if user is None:
            raise serializers.ValidationError("Invalid email or password")
        
        return super().validate(attrs)
    
    @classmethod
    def get_token(cls, user: 'User') -> dict:
        token = super().get_token(user)
        token['email'] = user.email
        return token