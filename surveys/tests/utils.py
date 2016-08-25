from django.conf import settings
from incuna_test_utils.testcases.api_examples import (
    APIExampleMixin as BaseAPIExampleMixin,
)
from incuna_test_utils.testcases.api_request import BaseAPIRequestTestCase
from incuna_test_utils.testcases.request import BaseRequestTestCase

from . import factories


class RequestTestCase(BaseRequestTestCase):
    user_factory = factories.UserFactory


class APIRequestTestCase(BaseAPIRequestTestCase):
    user_factory = factories.UserFactory


class APIExampleMixin(BaseAPIExampleMixin):
    EXAMPLES_DIR = settings.API_DESCRIPTION_DIR


def create_survey_data(cls):
    """
    For use in setUpTestData to build a survey.

    The survey has one fieldset, which has one field.
    """
    cls.field = factories.SurveyFieldFactory.create(pk=1, field_type='number')
    cls.fieldset = factories.SurveyFieldsetFactory.create(pk=1)
    cls.survey = factories.SurveyFactory.create(pk=1)

    factories.SurveyFieldOrderingFactory.create(
        field=cls.field,
        fieldset=cls.fieldset,
    )
    factories.SurveyFieldsetOrderingFactory.create(
        survey=cls.survey,
        fieldset=cls.fieldset,
    )


def create_api_example_data(cls):
    """More comprehensive test data that matches the API descriptions."""
    cls.survey = factories.SurveyFactory.create(
        pk=1,
        name='How have you been using the site?',
        description='Form description',
    )

    # Three fieldsets.
    cls.fieldset_one = factories.SurveyFieldsetFactory.create(
        pk=1,
        name='Free text field',
        description='Field group description',
    )
    cls.fieldset_two = factories.SurveyFieldsetFactory.create(
        pk=2,
        name='Numeric fields',
        description='Some additional text expanding on the above',
    )
    cls.fieldset_three = factories.SurveyFieldsetFactory.create(
        pk=3,
        name='Choice fields',
        description='Some additional text expanding on the above',
    )

    # Five fields, one for each type.
    cls.field_one = factories.SurveyFieldFactory.create(
        pk=1,
        name='How did you discover the site?',
        help_text='Search engine, friend...',
        field_type='free_text',
        required=True,
        answers=[],
    )
    cls.field_two = factories.SurveyFieldFactory.create(
        pk=2,
        name='What is the answer to the ultimate question?',
        help_text='',
        field_type='number',
        required=False,
        answers=[],
    )
    cls.field_three = factories.SurveyFieldFactory.create(
        pk=3,
        name='How much percentage does it take?',
        help_text='',
        field_type='percentage',
        required=True,
        answers=[],
    )
    cls.field_four = factories.SurveyFieldFactory.create(
        pk=4,
        name='How many time do you visit the site per day?',
        help_text='Choose a valid answer.',
        field_type='radio',
        required=True,
        answers=['One time', 'Two times', 'Three times or more'],
    )
    cls.field_five = factories.SurveyFieldFactory.create(
        pk=5,
        name='Choose more than one answer.',
        help_text='',
        field_type='checkbox',
        required=False,
        answers=['One time', 'Two times', 'Three times or more'],
    )

    # Attach each fieldset to the survey.
    factories.SurveyFieldsetOrderingFactory.create(
        survey=cls.survey,
        fieldset=cls.fieldset_one,
    )
    factories.SurveyFieldsetOrderingFactory.create(
        survey=cls.survey,
        fieldset=cls.fieldset_two,
    )
    factories.SurveyFieldsetOrderingFactory.create(
        survey=cls.survey,
        fieldset=cls.fieldset_three,
    )

    # Attach each field to a fieldset.
    factories.SurveyFieldOrderingFactory.create(
        field=cls.field_one,
        fieldset=cls.fieldset_one,
    )
    factories.SurveyFieldOrderingFactory.create(
        field=cls.field_two,
        fieldset=cls.fieldset_two,
    )
    factories.SurveyFieldOrderingFactory.create(
        field=cls.field_three,
        fieldset=cls.fieldset_two,
    )
    factories.SurveyFieldOrderingFactory.create(
        field=cls.field_four,
        fieldset=cls.fieldset_three,
    )
    factories.SurveyFieldOrderingFactory.create(
        field=cls.field_five,
        fieldset=cls.fieldset_three,
    )
