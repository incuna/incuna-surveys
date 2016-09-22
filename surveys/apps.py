from collections import OrderedDict

from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _

from . import (
    form_field_generators as form_fields,
    serializer_field_generators as serializer_fields,
)


class SurveyConfig(AppConfig):
    name = 'surveys'

    # Complete dictionary of customisable data per field type.
    # Has to be Ordered so we can guarantee consistent behaviour on things making
    # use of it (dropdown fields etc).
    field_type_data = OrderedDict((
        ('free_text', {
            'display_text': _('Character field (free text)'),
            'form_field_factory': form_fields.CharFieldGenerator,
            'serializer_field_factory': serializer_fields.CharFieldGenerator,
        }),
        ('number', {
            'display_text': _('Number'),
            'form_field_factory': form_fields.NumberFieldGenerator,
            'serializer_field_factory': serializer_fields.NumberFieldGenerator,
        }),
        ('percentage', {
            'display_text': _('Percentage'),
            'form_field_factory': form_fields.PercentageFieldGenerator,
            'serializer_field_factory': serializer_fields.PercentageFieldGenerator,
        }),
        ('radio', {
            'display_text': _('Choose one option'),
            'form_field_factory': form_fields.RadioFieldGenerator,
            'serializer_field_factory': serializer_fields.ChoiceFieldGenerator,
        }),
        ('checkbox', {
            'display_text': _('Choose one or more options'),
            'form_field_factory': form_fields.MultipleChoiceFieldGenerator,
            'serializer_field_factory': serializer_fields.MultipleChoiceFieldGenerator,
        }),
        ('proportion', {
            'display_text': _('Proportions of one or more numbers'),
            'serializer_field_factory': serializer_fields.MultipleIntegerFieldGenerator,
        }),
    ))

    def __init__(self, *args, **kwargs):
        """Construct any data that depends on field_type_data dynamically."""
        super().__init__(*args, **kwargs)
        field_data_items = self.field_type_data.items()

        # Choices suitable for the field_type dropdown on SurveyField.
        self.field_type_choices = []
        # Convenient mappings of field types to form/serializer field factories.
        self.form_field_factories = {}
        self.serializer_field_factories = {}
        for k, v in field_data_items:
            self.field_type_choices.append((k, v['display_text']))
            self.form_field_factories[k] = v.get('form_field_factory', None)
            self.serializer_field_factories[k] = v.get('serializer_field_factory', None)
