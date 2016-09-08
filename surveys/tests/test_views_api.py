from django.http import Http404

from .factories import (
    SurveyFieldOrderingFactory,
    SurveyFieldsetOrderingFactory,
    UserResponseFactory,
)
from .utils import (
    APIExampleMixin,
    APIRequestTestCase,
    create_api_example_data,
    create_survey_data,
)
from .. import views_api
from ..models import UserResponse
from ..serializers import json_decode, SurveySerializer


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
            '1': {'1': 42}
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
        self.assertEqual(user_response.answers, data['1'])

    def test_post_object_created(self):
        """Test that the view creates UserResponses correctly."""
        data = self.get_post_data()
        response = self.call_post_view(data)
        self.assertEqual(response.status_code, 201, response.data)

        # Assert the UserResponse object was created correctly.
        user_response = UserResponse.objects.first()
        self.assertEqual(user_response.user_id, self.user_id)
        self.assertEqual(user_response.answers, data['1'])

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
            answers={'2': 15, '3': 5},
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

        # The data is asserted thoroughly in the serializer test, so we'll just check
        # that it's the same data here and hasn't been tampered with.  That way, if the
        # serializer is broken, only that test should fail, and this test will be
        # unconcerned by changes to the serializer format.
        url = '/forms/pk/respond/user_id'
        expected_data = self.api_example_data(url, 'get')['OK']['response_data']

        data = json_decode(response.data)
        self.assertEqual(data, expected_data)

    def test_missing_user_id(self):
        """Test that the view deals elegantly with an unrecognised user_id."""
        view = views_api.SurveyGetLatestCreateView.as_view()
        request = self.create_request()
        response = view(request, pk=self.survey.pk, user_id='nonsense')
        expected_data = {
            '3': {'5': None, '4': None},
            '1': {'1': ''},
            '2': {'3': None, '2': None}
        }
        data = json_decode(response.data)
        self.assertEqual(data, expected_data)

    def test_new_fieldset(self):
        """Test that the view deals with fielset being added to the form."""
        sfo = SurveyFieldsetOrderingFactory.create(
            survey=self.survey,
        )
        fielset = sfo.fieldset

        view = views_api.SurveyGetLatestCreateView.as_view()
        request = self.create_request()
        response = view(request, pk=self.survey.pk, user_id=self.user_id)
        url = '/forms/pk/respond/user_id'
        expected_data = self.api_example_data(url, 'get')['OK']['response_data']
        expected_data[str(fielset.pk)] = {}
        data = json_decode(response.data)
        self.assertEqual(data, expected_data)

    def test_new_field(self):
        """Test that the view deals with a field being added to the form."""
        SurveyFieldOrderingFactory.create(
            field=self.field_one,
            fieldset=self.fieldset_three,
        )

        view = views_api.SurveyGetLatestCreateView.as_view()
        request = self.create_request()
        response = view(request, pk=self.survey.pk, user_id=self.user_id)
        url = '/forms/pk/respond/user_id'
        expected_data = self.api_example_data(url, 'get')['OK']['response_data']
        expected_data[str(self.fieldset_three.pk)][str(self.field_one.pk)] = ''
        data = json_decode(response.data)
        self.assertEqual(data, expected_data)

    def test_missing_fieldset(self):
        """Test that the view deals with fieldset data being removed from the from."""
        key = str(self.fieldset_two.pk)
        self.fieldset_two.delete()

        view = views_api.SurveyGetLatestCreateView.as_view()
        request = self.create_request()
        response = view(request, pk=self.survey.pk, user_id=self.user_id)
        url = '/forms/pk/respond/user_id'
        expected_data = self.api_example_data(url, 'get')['OK']['response_data']
        del expected_data[key]
        data = json_decode(response.data)
        self.assertEqual(data, expected_data)

    def test_missing_field(self):
        """Test that the view deals with field data being removed from the from."""
        key = str(self.field_five.pk)
        self.field_five.delete()

        view = views_api.SurveyGetLatestCreateView.as_view()
        request = self.create_request()
        response = view(request, pk=self.survey.pk, user_id=self.user_id)
        url = '/forms/pk/respond/user_id'
        expected_data = self.api_example_data(url, 'get')['OK']['response_data']
        del expected_data[str(self.fieldset_three.pk)][key]
        data = json_decode(response.data)
        self.assertEqual(data, expected_data)
