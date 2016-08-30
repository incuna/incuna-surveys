import json

from django.http import Http404

from .factories import UserResponseFactory
from .utils import (
    APIExampleMixin,
    APIRequestTestCase,
    create_api_example_data,
    create_survey_data,
)
from .. import views_api
from ..models import UserResponse
from ..serializers import SurveySerializer


class TestSurveyListView(APIRequestTestCase):
    @classmethod
    def setUpTestData(cls):
        create_survey_data(cls)

    def test_get(self):
        """Test that the view can retrieve a survey and return correct JSON."""
        view = views_api.SurveyListView.as_view()
        request = self.create_request()
        response = view(request)

        self.assertEqual(response.status_code, 200)

        expected_data = SurveySerializer(
            instance=[self.survey],
            context={'request': request},
            many=True,
        ).data
        self.assertEqual(response.data, expected_data)


class TestSurveyViews(APIRequestTestCase):
    user_id = 'User#20#'

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

    def get_post_data(self):
        """Helper method.  Produces suitable POST data."""
        return {
            'user_responses': [
                {
                    'fieldset': 1,
                    'answers': {'1': 42}
                }
            ],
        }

    def call_post_view(self, data):
        """Helper method.  Calls the post view with the specified data."""
        view = views_api.SurveyCreateView.as_view()
        request = self.create_request(method='post', data=data)
        return view(request, pk=self.survey.pk, user_id=self.user_id)

    def test_post_response(self):
        """Test that the view can retrieve a survey and return correct JSON."""
        data = self.get_post_data()
        response = self.call_post_view(data)
        self.assertEqual(response.status_code, 201, response.data)

        # Assert the UserResponse object was created correctly.
        user_response = UserResponse.objects.first()
        self.assertEqual(user_response.user_id, self.user_id)
        self.assertEqual(user_response.answers, data['user_responses'][0]['answers'])

    def test_post_object_created(self):
        """Test that the view creates UserResponses correctly."""
        data = self.get_post_data()
        response = self.call_post_view(data)
        self.assertEqual(response.status_code, 201, response.data)

        # Assert the UserResponse object was created correctly.
        user_response = UserResponse.objects.first()
        self.assertEqual(user_response.user_id, self.user_id)
        self.assertEqual(user_response.answers, data['user_responses'][0]['answers'])

    def test_post_404(self):
        wrong_pk = self.survey.pk + 42

        view = views_api.SurveyCreateView.as_view()
        request = self.create_request(method='post', data={})

        with self.assertRaises(Http404):
            view(request, pk=wrong_pk, user_id=self.user_id)


class TestSurveyGetLatestCreateView(APIExampleMixin, APIRequestTestCase):
    @classmethod
    def setUpTestData(cls):
        create_api_example_data(cls)

        cls.user_id = 'User#20#'
        UserResponseFactory.create(
            user_id=cls.user_id,
            fieldset=cls.fieldset_one,
            survey=cls.survey,
            answers={'1': 'Friends'},
        )
        UserResponseFactory.create(
            user_id=cls.user_id,
            fieldset=cls.fieldset_two,
            survey=cls.survey,
            answers={'3': 5},
        )
        UserResponseFactory.create(
            user_id=cls.user_id,
            fieldset=cls.fieldset_three,
            survey=cls.survey,
            answers={'4': 0, '5': [1, 2]},
        )

    def test_get(self):
        """Test that the view can retrieve a survey and return correct JSON."""
        view = views_api.SurveyGetLatestCreateView.as_view()
        request = self.create_request()
        response = view(request, pk=self.survey.pk, user_id=self.user_id)

        self.assertEqual(response.status_code, 200)

        # Take the data to and from JSON to turn integer indices into strings.
        data = json.loads(json.dumps(response.data))
        url = '/forms/pk/respond/user_id'
        expected_data = self.api_example_data(url, 'get')['OK']['response_data']
        self.assertEqual(data, expected_data)

    def test_missing_user_id(self):
        """Test that the view deals elegantly with an unrecognised user_id."""
        view = views_api.SurveyGetLatestCreateView.as_view()
        request = self.create_request()
        response = view(request, pk=self.survey.pk, user_id='nonsense')
        self.assertEqual(response.data, {})
