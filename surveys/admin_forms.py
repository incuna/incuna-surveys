from django import forms
from django.contrib.postgres.forms import SimpleArrayField
from parler.forms import TranslatableModelForm

from .models import SurveyField


class SurveyFieldForm(TranslatableModelForm):
    answers = SimpleArrayField(forms.CharField(), delimiter='\r\n', widget=forms.Textarea)

    class Meta:
        model = SurveyField
        fields = (
            'name',
            'field_type',
            'help_text',
            'answers',
            'required',
        )
