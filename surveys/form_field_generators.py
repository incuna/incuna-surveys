from django import forms
from django.core import validators

from .generators import BaseFieldGenerator


class CharFieldGenerator(BaseFieldGenerator):
    """A class for generating a dynamic CharField."""
    field_class = forms.CharField


class NumberFieldGenerator(BaseFieldGenerator):
    """A class for generating an IntegerField."""
    field_class = forms.IntegerField


class PercentageFieldGenerator(NumberFieldGenerator):
    """A class for generating a percentage field."""
    def get_field_kwargs(self, instance):
        kwargs = super().get_field_kwargs(instance)
        kwargs['validators'] = [
            validators.MinValueValidator(0),
            validators.MaxValueValidator(100),
        ]
        return kwargs


class ChoiceFieldGenerator(BaseFieldGenerator):
    """A class for generating a ChoiceField."""
    field_class = forms.ChoiceField

    def get_field_kwargs(self, instance):
        kwargs = super().get_field_kwargs(instance)
        kwargs['choices'] = list(enumerate(instance.answers))
        return kwargs


class RadioFieldGenerator(ChoiceFieldGenerator):
    """A class for generating a radio button field."""
    def get_field_kwargs(self, instance):
        kwargs = super().get_field_kwargs(instance)
        kwargs['widget'] = forms.RadioSelect()
        return kwargs


class MultipleChoiceFieldGenerator(ChoiceFieldGenerator):
    """A class for generating a MultipleChoiceField."""
    field_class = forms.MultipleChoiceField

    def get_field_kwargs(self, instance):
        kwargs = super().get_field_kwargs(instance)
        kwargs['widget'] = forms.CheckboxSelectMultiple
        return kwargs
