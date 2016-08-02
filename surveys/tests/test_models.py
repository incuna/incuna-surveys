from django.test import TestCase

from .factories import SurveyFieldFactory, SurveyFieldsetFactory, UserResponseFactory
from ..models import SurveyField, SurveyFieldset, UserResponse


class TestSurveyField(TestCase):
    model = SurveyField
    factory = SurveyFieldFactory

    def test_str(self):
        field = self.factory.build()
        self.assertEqual(str(field), field.name)

    def test_key(self):
        field = self.factory.build(pk=1)
        self.assertEqual(field.key, 'question-1')


class TestSurveyFieldset(TestCase):
    model = SurveyFieldset
    factory = SurveyFieldsetFactory

    def test_str(self):
        fieldset = self.factory.create()
        self.assertEqual(str(fieldset), fieldset.name)


class TestUserResponse(TestCase):
    model = UserResponse
    factory = UserResponseFactory

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
