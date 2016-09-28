from functools import partial

from django.core import validators
from rest_framework import serializers

from .generators import BaseFieldGenerator as BaseBaseFieldGenerator


class MultipleIntegerSerializer(serializers.Serializer):
    """Dynamically generate a serializer with IntegerField based on the choices"""
    def __init__(self, choices, *args, **kwargs):
        self.choices = choices
        super().__init__(*args, **kwargs)

    def get_fields(self):
        """
        Dynamically generate the fields from the choices ((key, label), ...).
        Returns a dictionary of {key: IntegerField(label=choice)}.
        """
        IntegerField = partial(serializers.IntegerField, required=False, allow_null=True)
        return {
            str(key): IntegerField(label=label)
            for key, label in self.choices
        }


class BaseFieldGenerator(BaseBaseFieldGenerator):
    def get_field_kwargs(self, instance):
        kwargs = super().get_field_kwargs(instance)
        kwargs['allow_null'] = not instance.required
        return kwargs


class CharFieldGenerator(BaseFieldGenerator):
    """A class for generating a dynamic CharField."""
    field_class = serializers.CharField

    def get_field_kwargs(self, instance):
        kwargs = super().get_field_kwargs(instance)
        kwargs['allow_blank'] = not instance.required
        return kwargs


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


class BaseChoiceFieldGenerator(BaseFieldGenerator):
    def get_field_kwargs(self, instance):
        kwargs = super().get_field_kwargs(instance)
        kwargs['choices'] = list(enumerate(instance.answers))
        return kwargs


class ChoiceFieldGenerator(BaseChoiceFieldGenerator):
    """A class for generating a ChoiceField."""
    field_class = serializers.ChoiceField

    def get_field_kwargs(self, instance):
        kwargs = super().get_field_kwargs(instance)
        kwargs['allow_blank'] = not instance.required
        return kwargs


class MultipleChoiceFieldGenerator(ChoiceFieldGenerator):
    """A class for generating a MultipleChoiceField."""
    field_class = serializers.MultipleChoiceField


class MultipleIntegerFieldGenerator(BaseChoiceFieldGenerator):
    """A class for generating a MultipleIntegerSerializer."""
    field_class = MultipleIntegerSerializer
