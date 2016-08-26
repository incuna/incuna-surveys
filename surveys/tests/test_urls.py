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

    def test_survey_post(self):
        user_id = 'User#20@!_ Id'
        quoted_user_id = 'User%2320@!_%20Id'
        self.assert_url_matches_view(
            view=views_api.SurveyCreateView,
            expected_url='/forms/{}/respond/{}/create'.format(self.pk, quoted_user_id),
            url_name='survey-post',
            url_kwargs={'pk': self.pk, 'user_id': user_id},
        )

    def test_survey_latest(self):
        user_id = 'User#20@!_ Id'
        quoted_user_id = 'User%2320@!_%20Id'
        self.assert_url_matches_view(
            view=views_api.SurveyGetLatestCreateView,
            expected_url='/forms/{}/respond/{}'.format(self.pk, quoted_user_id),
            url_name='survey-latest',
            url_kwargs={'pk': self.pk, 'user_id': user_id},
        )
