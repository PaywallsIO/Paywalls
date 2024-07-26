from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
from django.urls import include
from paywalls.api import (
    UserViewSet,
    PaywallViewSet
)
from rest_framework_simplejwt.views import TokenRefreshView
from paywalls.views import EmailTokenObtainPairView

api_router = DefaultRouter()
api_router.register(r'paywalls', PaywallViewSet, basename='paywalls')
api_router.register(r'users', UserViewSet, basename='users')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_router.urls)),
    path('api/token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
