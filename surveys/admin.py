from django.contrib import admin
from orderable.admin import OrderableAdmin, OrderableTabularInline

from . import models
from .admin_forms import SurveyFieldForm


class SurveyFieldAdmin(admin.ModelAdmin):
    list_display = ('name',)
    form = SurveyFieldForm


class SurveyFieldOrderingInline(OrderableTabularInline):
    model = models.SurveyFieldOrdering
    extra = 0
    min_num = 1


class SurveyFieldsetAdmin(admin.ModelAdmin):
    inlines = [SurveyFieldOrderingInline]
    list_display = ('name',)


class SurveyFieldOrderingAdmin(OrderableAdmin):
    list_display = ('field', 'fieldset', 'sort_order_display')
    list_filter = ('fieldset',)


class SurveyFieldsetOrderingInline(OrderableTabularInline):
    model = models.SurveyFieldsetOrdering
    extra = 0
    min_num = 1


class SurveyAdmin(admin.ModelAdmin):
    inlines = [SurveyFieldsetOrderingInline]
    list_display = ('name',)


class SurveyFieldsetOrderingAdmin(OrderableAdmin):
    list_display = ('survey', 'fieldset', 'sort_order_display')
    list_filter = ('survey',)


class UserResponseAdmin(OrderableAdmin):
    list_display = ('fieldset', 'user_id')


admin.site.register(models.SurveyField, SurveyFieldAdmin)
admin.site.register(models.SurveyFieldset, SurveyFieldsetAdmin)
admin.site.register(models.Survey, SurveyAdmin)
admin.site.register(models.SurveyFieldOrdering, SurveyFieldOrderingAdmin)
admin.site.register(models.SurveyFieldsetOrdering, SurveyFieldsetOrderingAdmin)
admin.site.register(models.UserResponse, UserResponseAdmin)
