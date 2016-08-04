from collections import OrderedDict

from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _


class SurveyConfig(AppConfig):
    name = 'surveys'

    # Complete dictionary of customisable data per field type.
    # Has to be Ordered so we can guarantee consistent behaviour on things making
    # use of it (dropdown fields etc).
    field_type_data = OrderedDict((
        ('free_text', {
            'display_text': _('Character field (free text)'),
            'form_field_factory': None,
            'serializer_field_factory': None,
        }),
        ('number', {
            'display_text': _('Number'),
            'form_field_factory': None,
            'serializer_field_factory': None,
        }),
        ('percentage', {
            'display_text': _('Percentage'),
            'form_field_factory': None,
            'serializer_field_factory': None,
        }),
        ('radio', {
            'display_text': _('Choose one option'),
            'form_field_factory': None,
            'serializer_field_factory': None,
        }),
        ('checkbox', {
            'display_text': _('Choose one or more options'),
            'form_field_factory': None,
            'serializer_field_factory': None,
        }),
    ))

    def __init__(self, *args, **kwargs):
        """Construct any data that depends on field_type_data dynamically."""
        super().__init__(*args, **kwargs)
        field_data_items = self.field_type_data.items()

        # Choices suitable for the field_type dropdown on SurveyField.
        self.field_type_choices = [(k, v['display_text']) for k, v in field_data_items]

        # Convenient mappings of field types to form/serializer field factories.
        self.form_field_factories = {
            k: v['form_field_factory'] for k, v in field_data_items
        }
        self.serializer_field_factories = {
            k: v['serializer_field_factory'] for k, v in field_data_items
        }
