from django import forms
from django.test import TestCase

from .factories import SurveyFieldFactory
from .. import form_field_generators


class TestFormFieldGenerators(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.survey_field = SurveyFieldFactory.create()
        cls.survey_field.answers = [str(n) for n in range(1, 6)]
        cls.choices = list(enumerate(cls.survey_field.answers))

    def test_choice_field_generator(self):
        generator = form_field_generators.ChoiceFieldGenerator()
        field = generator.generate_field(self.survey_field)

        self.assertIsInstance(field, forms.ChoiceField)
        self.assertEqual(field.choices, self.choices)
        self.assertTrue(field.required)

    def test_radio_field_generator(self):
        generator = form_field_generators.RadioFieldGenerator()
        field = generator.generate_field(self.survey_field)

        self.assertIsInstance(field, forms.ChoiceField)
        self.assertIsInstance(field.widget, forms.RadioSelect)
        self.assertEqual(field.choices, self.choices)
        self.assertTrue(field.required)

    def test_segmented_field_generator(self):
        generator = form_field_generators.SegmentedFieldGenerator()
        field = generator.generate_field(self.survey_field)

        self.assertIsInstance(field, forms.ChoiceField)
        self.assertIsInstance(field.widget, forms.RadioSelect)
        self.assertEqual(field.choices, self.choices)
        self.assertEqual(field.widget.attrs['class'], 'segmented')
        self.assertTrue(field.required)

    def test_multiple_choice_field_generator(self):
        generator = form_field_generators.MultipleChoiceFieldGenerator()
        field = generator.generate_field(self.survey_field)

        self.assertIsInstance(field, forms.MultipleChoiceField)
        self.assertEqual(field.choices, self.choices)
        self.assertFalse(field.required)
