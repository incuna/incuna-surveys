from incuna_test_utils.testcases.urls import URLTestCase

from .. import views_api


class TestAPIUrls(URLTestCase):
    pk = 42

    def test_survey_form(self):
        self.assert_url_matches_view(
            view=views_api.SurveyView,
            expected_url='/forms/{}'.format(self.pk),
            url_name='survey-form',
            url_kwargs={'pk': self.pk},
        )
