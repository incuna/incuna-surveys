from django import forms

from .generators import BaseFieldGenerator


class ChoiceFieldGenerator(BaseFieldGenerator):
    """A class for generating a dynamic ChoiceField."""
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


class SegmentedFieldGenerator(ChoiceFieldGenerator):
    """A class for generating a bar of numbered segments representing choices."""
    def get_field_kwargs(self, instance):
        kwargs = super().get_field_kwargs(instance)
        kwargs['widget'] = forms.RadioSelect(attrs={'class': 'segmented'})
        return kwargs


class MultipleChoiceFieldGenerator(ChoiceFieldGenerator):
    """A class for generating a dynamic MultipleChoiceField."""
    field_class = forms.MultipleChoiceField
    required = False

    def get_field_kwargs(self, instance):
        kwargs = super().get_field_kwargs(instance)
        kwargs['widget'] = forms.CheckboxSelectMultiple
        return kwargs
