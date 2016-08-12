from incuna_test_utils.testcases.request import BaseRequestTestCase

from . import factories


class RequestTestCase(BaseRequestTestCase):
    user_factory = factories.UserFactory


def create_survey_data(cls):
    """
    For use in setUpTestData to build a survey.

    The survey has one fieldset, which has one field.
    """
    cls.field = factories.SurveyFieldFactory.create(field_type='number')
    cls.fieldset = factories.SurveyFieldsetFactory.create()
    cls.survey = factories.SurveyFactory.create()

    factories.SurveyFieldOrderingFactory.create(
        field=cls.field,
        fieldset=cls.fieldset,
    )
    factories.SurveyFieldsetOrderingFactory.create(
        survey=cls.survey,
        fieldset=cls.fieldset,
    )
