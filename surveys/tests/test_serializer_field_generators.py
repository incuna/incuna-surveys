from collections import OrderedDict

from django.test import TestCase
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .factories import SurveyFieldFactory
from .. import serializer_field_generators


class TestSerializerFieldGenerators(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.survey_field = SurveyFieldFactory.create()
        cls.survey_field.answers = [str(n) for n in range(1, 6)]
        cls.choices = OrderedDict(enumerate(cls.survey_field.answers))

    def test_char_field_generator(self):
        generator = serializer_field_generators.CharFieldGenerator()
        field = generator.generate_field(self.survey_field)

        self.assertIsInstance(field, serializers.CharField)
        self.assertFalse(field.required)

    def test_required_field(self):
        generator = serializer_field_generators.CharFieldGenerator()
        survey_field = SurveyFieldFactory.create(required=True)
        field = generator.generate_field(survey_field)

        self.assertIsInstance(field, serializers.CharField)
        self.assertTrue(field.required)

    def test_number_field_generator(self):
        generator = serializer_field_generators.NumberFieldGenerator()
        field = generator.generate_field(self.survey_field)

        self.assertIsInstance(field, serializers.IntegerField)

    def test_percentage_field_generator(self):
        generator = serializer_field_generators.PercentageFieldGenerator()
        field = generator.generate_field(self.survey_field)

        self.assertIsInstance(field, serializers.IntegerField)

        with self.assertRaises(ValidationError):
            field.run_validators(101)

        with self.assertRaises(ValidationError):
            field.run_validators(-1)

    def test_choice_field_generator(self):
        generator = serializer_field_generators.ChoiceFieldGenerator()
        field = generator.generate_field(self.survey_field)

        self.assertIsInstance(field, serializers.ChoiceField)
        self.assertEqual(field.choices, self.choices)

    def test_multiple_choice_field_generator(self):
        generator = serializer_field_generators.MultipleChoiceFieldGenerator()
        field = generator.generate_field(self.survey_field)

        self.assertIsInstance(field, serializers.MultipleChoiceField)
        self.assertEqual(field.choices, self.choices)
