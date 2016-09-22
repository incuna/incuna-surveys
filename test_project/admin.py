from django.contrib import admin

from surveys.base_admin import (
    SurveyAdmin,
    SurveyFieldAdmin,
    SurveyFieldOrderingAdmin,
    SurveyFieldsetAdmin,
    SurveyFieldsetOrderingAdmin,
    UserResponseAdmin,
)
from surveys.models import (
    Survey,
    SurveyField,
    SurveyFieldOrdering,
    SurveyFieldset,
    SurveyFieldsetOrdering,
    UserResponse,
)


admin.site.register(SurveyField, SurveyFieldAdmin)
admin.site.register(SurveyFieldset, SurveyFieldsetAdmin)
admin.site.register(Survey, SurveyAdmin)
admin.site.register(SurveyFieldOrdering, SurveyFieldOrderingAdmin)
admin.site.register(SurveyFieldsetOrdering, SurveyFieldsetOrderingAdmin)
admin.site.register(UserResponse, UserResponseAdmin)
