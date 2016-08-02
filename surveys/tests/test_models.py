from django.test import TestCase

from . import factories
from .. import models


class TestSurveyField(TestCase):
    model = models.SurveyField
    factory = factories.SurveyFieldFactory

    def test_str(self):
        field = self.factory.build()
        self.assertEqual(str(field), field.name)

    def test_key(self):
        field = self.factory.build(pk=1)
        self.assertEqual(field.key, 'question-1')


class TestUserResponse(TestCase):
    model = models.UserResponse

    def test_not_required(self):
        """
        This will throw an error if answers=[] is not allowed.

        Without accepting answers=[] on UserResponse, we can't have non-required
        questionnaire form fields.
        """
        factories.UserResponseFactory.create(answers=[])

    def test_num_users(self):
        factories.UserResponseFactory.create_batch(2, user_id='first_user')
        factories.UserResponseFactory.create(user_id='second_user')
        self.assertEqual(self.model.objects.num_users(), 2)


class TestSurveyFieldset(TestCase):
    model = models.SurveyFieldset
    factory = factories.SurveyFieldsetFactory

    def test_str(self):
        fieldset = self.factory.create()
        self.assertEqual(str(fieldset), fieldset.name)
