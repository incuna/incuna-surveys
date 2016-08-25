from django.forms import ModelForm

from .fields import ArrayFieldTextarea
from .models import SurveyField


class SurveyFieldForm(ModelForm):
    class Meta:
        model = SurveyField
        fields = (
            'name',
            'field_type',
            'help_text',
            'answers',
            'required',
        )
        widgets = {
            'answers': ArrayFieldTextarea(),
        }
