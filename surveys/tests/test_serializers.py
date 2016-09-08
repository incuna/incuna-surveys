from .utils import APIExampleMixin, APIRequestTestCase, create_api_example_data
from .. import models, serializers


class TestSerializers(APIExampleMixin, APIRequestTestCase):
    @classmethod
    def setUpTestData(cls):
        create_api_example_data(cls)

    def test_get(self):
        """Test the heavily nested SurveySerializer serializes data correctly."""
        serializer = serializers.SurveySerializer(
            instance=self.survey,
            context={'request': self.create_request(SERVER_NAME='localhost:8000')},
        )
        data = serializer.data
        expected_data = self.api_example_data('/forms/pk', 'get')['OK']['response_data']

        self.assertEqual(expected_data, data)

    def test_get_many(self):
        """Test the heavily nested SurveySerializer serializes data correctly."""
        serializer = serializers.SurveySerializer(
            instance=[self.survey],
            context={'request': self.create_request(SERVER_NAME='localhost:8000')},
            many=True,
        )
        data = serializer.data
        expected_data = self.api_example_data('/forms', 'get')['OK']['response_data']

        self.assertEqual(expected_data, data)

    def test_post(self):
        data = self.api_example_data('/forms/pk/respond/user_id', 'post')['fields']

        # Assert that we pass validation.
        context = {'survey': self.survey}
        serializer = serializers.SurveyResponseSerializer(data=data, context=context)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        validated_data = serializer.validated_data
        validated_data['survey'] = self.survey
        validated_data['user_id'] = 'User#20#'

        # Assert that one response per fieldset is created.
        serializer.create(validated_data)

        self.assertEqual(models.UserResponse.objects.count(), 3)

        # Assert enough detail about one of the responses to verify the data has been
        # passed through.
        response = models.UserResponse.objects.get(fieldset=self.fieldset_one)
        self.assertEqual(response.survey, self.survey)
        self.assertEqual(response.fieldset, self.fieldset_one)
        self.assertEqual(response.answers, {'1': 'Friends'})

    def test_post_fail_validation(self):
        data = self.api_example_data('/forms/pk/respond/user_id', 'post')['fields']

        # Change the submitted response to the third question so as to make it fail
        # validation.
        data['2']['2'] = 'Not a number'
        data['2']['3'] = 'Not a number'

        context = {'survey': self.survey}
        serializer = serializers.SurveyResponseSerializer(data=data, context=context)
        self.assertFalse(serializer.is_valid())

        field_errors = serializer.errors['2']['2']
        self.assertIn('A valid integer is required.', field_errors)
        field_errors = serializer.errors['2']['3']
        self.assertIn('A valid integer is required.', field_errors)
