from django.forms import IntegerField as FormIntegerField
from django.test import TestCase
from rest_framework.serializers import IntegerField as SerializerIntegerField

from . import factories
from .. import models


class TestSurveyField(TestCase):
    model = models.SurveyField
    factory = factories.SurveyFieldFactory

    @classmethod
    def setUpTestData(cls):
        cls.field = factories.SurveyFieldFactory.build(pk=1, field_type='number')

    def test_str(self):
        self.assertEqual(str(self.field), self.field.name)

    def test_key(self):
        self.assertEqual(self.field.key, 'question-1')

    def test_get_form_field(self):
        form_field = self.field.get_form_field()
        self.assertIsInstance(form_field, FormIntegerField)

    def test_get_serializer_field(self):
        form_field = self.field.get_serializer_field()
        self.assertIsInstance(form_field, SerializerIntegerField)


class TestSurveyFieldset(TestCase):
    model = models.SurveyFieldset
    factory = factories.SurveyFieldsetFactory

    def test_str(self):
        fieldset = self.factory.create()
        self.assertEqual(str(fieldset), fieldset.name)


class TestSurvey(TestCase):
    model = models.Survey
    factory = factories.SurveyFactory

    def test_str(self):
        survey = self.factory.create()
        self.assertEqual(str(survey), survey.name)


class TestUserResponse(TestCase):
    model = models.UserResponse
    factory = factories.UserResponseFactory

    def test_not_required(self):
        """
        This will throw an error if answers=[] is not allowed.

        Without accepting answers=[] on UserResponse, we can't have non-required
        questionnaire form fields.
        """
        self.factory.create(answers=[])

    def test_num_users(self):
        self.factory.create_batch(2, user_id='first_user')
        self.factory.create(user_id='second_user')
        self.assertEqual(self.model.objects.num_users(), 2)
