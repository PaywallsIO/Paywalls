from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from paywalls.models import Paywall, Team
from paywalls.models import User
from django.utils.translation import gettext_lazy as _

admin.site.register(Team)

@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    list_display = ('id', 'email', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('email',)
    ordering = ('id',)

@admin.register(Paywall)
class PaywallAdmin(admin.ModelAdmin):
    list_display = ('id', 'team', 'content')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.order_by('id')