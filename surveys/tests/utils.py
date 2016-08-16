from incuna_test_utils.testcases.api_request import BaseAPIRequestTestCase
from incuna_test_utils.testcases.request import BaseRequestTestCase

from . import factories


class RequestTestCase(BaseRequestTestCase):
    user_factory = factories.UserFactory


class APIRequestTestCase(BaseAPIRequestTestCase):
    user_factory = factories.UserFactory


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
