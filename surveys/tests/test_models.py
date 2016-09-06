from django.forms import IntegerField as FormIntegerField
from django.test import TestCase
from rest_framework.reverse import reverse as drf_reverse
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

    def test_get_ordered_fields(self):
        fieldset = self.factory.create()
        second = factories.SurveyFieldOrderingFactory.create(
            fieldset=fieldset,
            sort_order=2,
        ).field
        first = factories.SurveyFieldOrderingFactory.create(
            fieldset=fieldset,
            sort_order=1,
        ).field

        self.assertCountEqual(fieldset.fields.all(), [second, first])
        self.assertCountEqual(fieldset.get_ordered_fields(), [first, second])


class TestSurvey(TestCase):
    model = models.Survey
    factory = factories.SurveyFactory

    def test_str(self):
        survey = self.factory.create()
        self.assertEqual(str(survey), survey.name)

    def test_get_api_url(self):
        survey = self.factory.create()
        expected_url = drf_reverse('survey-form', kwargs={'pk': survey.pk})
        self.assertEqual(survey.get_api_url(), expected_url)

    def test_get_ordered_fieldsets(self):
        survey = self.factory.create()
        second = factories.SurveyFieldsetOrderingFactory.create(
            survey=survey,
            sort_order=2,
        ).fieldset
        first = factories.SurveyFieldsetOrderingFactory.create(
            survey=survey,
            sort_order=1,
        ).fieldset

        self.assertCountEqual(survey.fieldsets.all(), [second, first])
        self.assertCountEqual(survey.get_ordered_fieldsets(), [first, second])


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


class TestUserResponseManager(TestCase):
    manager = models.UserResponse.objects
    factory = factories.UserResponseFactory

    @classmethod
    def setUpTestData(cls):
        cls.survey = factories.SurveyFactory.create()
        cls.one, cls.two = cls.factory.create_batch(2, survey=cls.survey)
        cls.newer = cls.factory.create(
            survey=cls.survey,
            fieldset=cls.one.fieldset,
            user_id=cls.one.user_id,
        )

        cls.other = cls.factory.create()
        cls.other_survey = cls.other.survey

        # Won't show up since it has no responses
        cls.unseen_survey = factories.SurveyFactory.create()

        cls.expected_latest = {
            cls.survey.pk: {
                cls.newer.user_id: {
                    cls.newer.fieldset.pk: {
                        'answers': cls.newer.answers,
                        'date_created': cls.newer.date_created,
                    }
                },
                cls.two.user_id: {
                    cls.two.fieldset.pk: {
                        'answers': cls.two.answers,
                        'date_created': cls.two.date_created,
                    }
                }
            },
            cls.other_survey.pk: {
                cls.other.user_id: {
                    cls.other.fieldset.pk: {
                        'answers': cls.other.answers,
                        'date_created': cls.other.date_created,
                    }
                }
            },
        }

    def test_latest_responses(self):
        latest = dict(self.manager.latest_responses())
        self.assertEqual(latest, self.expected_latest)

    def test_latest_for_survey(self):
        latest = dict(self.manager.latest_for_survey(self.survey))
        expected = self.expected_latest[self.survey.pk]
        self.assertEqual(latest, expected)

    def test_latest_for_survey_empty(self):
        latest = dict(self.manager.latest_for_survey(self.unseen_survey))
        self.assertEqual(latest, {})

    def test_latest_for_user(self):
        latest = dict(self.manager.latest_for_user(self.survey, self.one.user_id))
        expected = self.expected_latest[self.survey.pk][self.one.user_id]
        self.assertEqual(latest, expected)

    def test_latest_for_user_empty_survey(self):
        latest = dict(self.manager.latest_for_user(self.unseen_survey, self.one.user_id))
        self.assertEqual(latest, {})

    def test_latest_for_user_empty_user(self):
        latest = dict(self.manager.latest_for_user(self.survey, 'nonexistent_id'))
        self.assertEqual(latest, {})
