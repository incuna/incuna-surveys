from django import forms
from django.contrib.postgres.forms import SimpleArrayField
from parler.forms import TranslatableModelForm

from .models import SurveyField


class SurveyFieldForm(TranslatableModelForm):
    answers = SimpleArrayField(
        forms.CharField(),
        delimiter='\r\n',
        widget=forms.Textarea,
        required=False,
    )

    class Meta:
        model = SurveyField
        fields = (
            'name',
            'field_type',
            'help_text',
            'answers',
            'required',
            'important',
        )

    def clean(self):
        data = super().clean()

        if not data['answers'] and (
            data['field_type'] == 'radio' or
            data['field_type'] == 'checkbox'
        ):
            raise forms.ValidationError('A choice field must have answers.')

        return data
