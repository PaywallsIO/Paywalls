from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
from django.urls import include

from rest_framework_simplejwt.views import (
    TokenRefreshView
)

from paywalls.api import (
    PaywallViewSet,
    EmailTokenObtainPairSerializer
)

api_router = DefaultRouter()
api_router.register(r'paywalls', PaywallViewSet, basename='paywalls')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_router.urls)),
    path('api/token', EmailTokenObtainPairSerializer.as_view(), name='token_obtain_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]
