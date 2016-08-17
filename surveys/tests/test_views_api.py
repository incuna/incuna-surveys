from .utils import APIRequestTestCase, create_survey_data
from .. import views_api
from ..models import UserResponse
from ..serializers import SurveySerializer


class TestSurveyViews(APIRequestTestCase):
    @classmethod
    def setUpTestData(cls):
        create_survey_data(cls)

    def test_get(self):
        """Test that the view can retrieve a survey and return correct JSON."""
        view = views_api.SurveyView.as_view()
        request = self.create_request()
        response = view(request, pk=self.survey.pk)

        self.assertEqual(response.status_code, 200)

        # The data is asserted thoroughly in the serializer test, so we'll just check
        # that it's the same data here and hasn't been tampered with.  That way, if the
        # serializer is broken, only that test should fail, and this test will be
        # unconcerned by changes to the serializer format.
        expected_data = SurveySerializer(
            instance=self.survey,
            context={'request': request},
        ).data
        self.assertEqual(response.data, expected_data)

    def test_post(self):
        """Test that the view can retrieve a survey and return correct JSON."""
        view = views_api.SurveyPostView.as_view()
        data = {
            'user_id': 'User#20#',
            'user_responses': [
                {
                    'fieldset': 1,
                    'answers': {'1': 42}
                }
            ],
        }

        request = self.create_request(method='post', data=data)
        response = view(request, pk=self.survey.pk)

        self.assertEqual(response.status_code, 201, response.data)

        # Assert we return the same data but with the survey and user_id re-specified
        # on the objects that need them.
        data['survey'] = self.survey.pk
        data['user_responses'][0]['user_id'] = data['user_id']
        self.assertEqual(response.data, data)

        # Assert the UserResponse object was created correctly.
        user_response = UserResponse.objects.first()
        self.assertEqual(user_response.user_id, data['user_id'])
        self.assertEqual(user_response.answers, data['user_responses'][0]['answers'])
