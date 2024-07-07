from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from paywalls.models import Paywall, Team, User

admin.site.register(User, UserAdmin)
admin.site.register(Team)

@admin.register(Paywall)
class PaywallAdmin(admin.ModelAdmin):
    list_display = ('id', 'team', 'content')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.order_by('id')