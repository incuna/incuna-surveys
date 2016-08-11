from django import forms
from django.core.exceptions import ValidationError
from django.test import TestCase

from .factories import SurveyFieldFactory
from .. import form_field_generators


class TestFormFieldGenerators(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.survey_field = SurveyFieldFactory.create()
        cls.survey_field.answers = [str(n) for n in range(1, 6)]
        cls.choices = list(enumerate(cls.survey_field.answers))

    def test_char_field_generator(self):
        generator = form_field_generators.CharFieldGenerator()
        field = generator.generate_field(self.survey_field)

        self.assertIsInstance(field, forms.CharField)
        self.assertFalse(field.required)

    def test_required_field(self):
        generator = form_field_generators.CharFieldGenerator()
        survey_field = SurveyFieldFactory.create(required=True)
        field = generator.generate_field(survey_field)

        self.assertIsInstance(field, forms.CharField)
        self.assertTrue(field.required)

    def test_number_field_generator(self):
        generator = form_field_generators.NumberFieldGenerator()
        field = generator.generate_field(self.survey_field)

        self.assertIsInstance(field, forms.IntegerField)

    def test_percentage_field_generator(self):
        generator = form_field_generators.PercentageFieldGenerator()
        field = generator.generate_field(self.survey_field)

        self.assertIsInstance(field, forms.IntegerField)

        with self.assertRaises(ValidationError):
            field.run_validators(101)

        with self.assertRaises(ValidationError):
            field.run_validators(-1)

    def test_choice_field_generator(self):
        generator = form_field_generators.ChoiceFieldGenerator()
        field = generator.generate_field(self.survey_field)

        self.assertIsInstance(field, forms.ChoiceField)
        self.assertEqual(field.choices, self.choices)

    def test_radio_field_generator(self):
        generator = form_field_generators.RadioFieldGenerator()
        field = generator.generate_field(self.survey_field)

        self.assertIsInstance(field, forms.ChoiceField)
        self.assertIsInstance(field.widget, forms.RadioSelect)
        self.assertEqual(field.choices, self.choices)

    def test_multiple_choice_field_generator(self):
        generator = form_field_generators.MultipleChoiceFieldGenerator()
        field = generator.generate_field(self.survey_field)

        self.assertIsInstance(field, forms.MultipleChoiceField)
        self.assertEqual(field.choices, self.choices)
