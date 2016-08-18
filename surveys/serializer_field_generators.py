from django.core import validators
from rest_framework import serializers

from .generators import BaseFieldGenerator


class CharFieldGenerator(BaseFieldGenerator):
    """A class for generating a dynamic CharField."""
    field_class = serializers.CharField


class NumberFieldGenerator(BaseFieldGenerator):
    """A class for generating an IntegerField."""
    field_class = serializers.IntegerField


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
    field_class = serializers.ChoiceField

    def get_field_kwargs(self, instance):
        kwargs = super().get_field_kwargs(instance)
        kwargs['choices'] = list(enumerate(instance.answers))
        return kwargs


class MultipleChoiceFieldGenerator(ChoiceFieldGenerator):
    """A class for generating a MultipleChoiceField."""
    field_class = serializers.MultipleChoiceField
    required = False
