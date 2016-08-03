from django.contrib import admin
from orderable.admin import OrderableAdmin, OrderableTabularInline

from . import models
from .admin_forms import SurveyFieldForm


class SurveyFieldAdmin(OrderableAdmin):
    list_display = ('name',)
    form = SurveyFieldForm


class SurveyFieldOrderingInline(OrderableTabularInline):
    model = models.SurveyFieldOrdering
    extra = 0
    min_num = 1


class SurveyFieldsetAdmin(OrderableAdmin):
    inlines = [SurveyFieldOrderingInline]
    list_display = ('name', 'sort_order_display')


class SurveyFieldOrderingAdmin(OrderableAdmin):
    list_display = ('field', 'fieldset', 'sort_order_display')
    list_filter = ('fieldset',)


class UserResponseAdmin(OrderableAdmin):
    list_display = ('fieldset', 'user_id')


admin.site.register(models.SurveyField, SurveyFieldAdmin)
admin.site.register(models.SurveyFieldset, SurveyFieldsetAdmin)
admin.site.register(models.SurveyFieldOrdering, SurveyFieldOrderingAdmin)
admin.site.register(models.UserResponse, UserResponseAdmin)
