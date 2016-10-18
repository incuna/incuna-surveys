from parler.forms import TranslatableModelForm

from .fields import ArrayFieldTextarea
from .models import SurveyField


class SurveyFieldForm(TranslatableModelForm):
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
