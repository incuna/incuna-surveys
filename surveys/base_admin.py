from orderable.admin import OrderableAdmin, OrderableTabularInline
from parler.admin import TranslatableAdmin

from . import models
from .admin_forms import SurveyFieldForm


class SurveyFieldAdmin(TranslatableAdmin):
    list_display = ('name',)
    form = SurveyFieldForm
    list_filter = ('fieldsets',)


class SurveyFieldOrderingInline(OrderableTabularInline):
    model = models.SurveyFieldOrdering
    raw_id_fields = ('field',)
    extra = 1
    min_num = 1


class SurveyFieldsetAdmin(TranslatableAdmin):
    inlines = [SurveyFieldOrderingInline]
    list_display = ('name',)
    list_filter = ('surveys',)


class SurveyFieldOrderingAdmin(OrderableAdmin):
    list_display = ('field', 'fieldset', 'sort_order_display')
    list_filter = ('fieldset', 'field')


class SurveyFieldsetOrderingInline(OrderableTabularInline):
    model = models.SurveyFieldsetOrdering
    extra = 1
    min_num = 1


class SurveyAdmin(TranslatableAdmin):
    inlines = [SurveyFieldsetOrderingInline]
    list_display = ('name',)


class SurveyFieldsetOrderingAdmin(OrderableAdmin):
    list_display = ('survey', 'fieldset', 'sort_order_display')
    list_filter = ('survey', 'fieldset')


class UserResponseAdmin(OrderableAdmin):
    list_display = ('survey', 'fieldset', 'user_id')
    list_filter = ('survey', 'fieldset')
    list_display_links = list_display
