from incuna_test_utils.testcases.api_examples import APIExampleMixin

from . import factories
from .utils import APIRequestTestCase
from .. import models, serializers


class TestSerializers(APIExampleMixin, APIRequestTestCase):
    EXAMPLES_DIR = 'api-description'

    @classmethod
    def setUpTestData(cls):
        """Create a ton of survey objects to mirror the API example JSON."""
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
        fieldset_two = factories.SurveyFieldsetFactory.create(
            pk=2,
            name='Numeric fields',
            description='Some additional text expanding on the above',
        )
        fieldset_three = factories.SurveyFieldsetFactory.create(
            pk=3,
            name='Choice fields',
            description='Some additional text expanding on the above',
        )

        # Five fields, one for each type.

        field_one = factories.SurveyFieldFactory.create(
            pk=1,
            name='How did you discover the site?',
            help_text='Search engine, friend...',
            field_type='free_text',
            required=True,
            answers=[],
        )
        field_two = factories.SurveyFieldFactory.create(
            pk=2,
            name='What is the answer to the ultimate question?',
            help_text='',
            field_type='number',
            required=False,
            answers=[],
        )
        field_three = factories.SurveyFieldFactory.create(
            pk=3,
            name='How much percentage does it take?',
            help_text='',
            field_type='percentage',
            required=True,
            answers=[],
        )
        field_four = factories.SurveyFieldFactory.create(
            pk=4,
            name='How many time do you visit the site per day?',
            help_text='Choose a valid answer.',
            field_type='radio',
            required=True,
            answers=['One time', 'Two times', 'Three times or more'],
        )
        field_five = factories.SurveyFieldFactory.create(
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
            fieldset=fieldset_two,
        )
        factories.SurveyFieldsetOrderingFactory.create(
            survey=cls.survey,
            fieldset=fieldset_three,
        )

        # Attach each field to a fieldset.
        factories.SurveyFieldOrderingFactory.create(
            field=field_one,
            fieldset=cls.fieldset_one,
        )
        factories.SurveyFieldOrderingFactory.create(
            field=field_two,
            fieldset=fieldset_two,
        )
        factories.SurveyFieldOrderingFactory.create(
            field=field_three,
            fieldset=fieldset_two,
        )
        factories.SurveyFieldOrderingFactory.create(
            field=field_four,
            fieldset=fieldset_three,
        )
        factories.SurveyFieldOrderingFactory.create(
            field=field_five,
            fieldset=fieldset_three,
        )

    def test_get(self):
        """Test the heavily nested SurveySerializer serializes data correctly."""
        serializer = serializers.SurveySerializer(
            instance=self.survey,
            context={'request': self.create_request(SERVER_NAME='localhost:8000')},
        )
        data = serializer.data
        expected_data = self.api_example_data('/forms/pk', 'get')['OK']['response_data']
        print(expected_data)

        self.assertEqual(expected_data, data)

    def test_post(self):
        data = self.api_example_data('/forms/pk', 'post')['fields']
        data['survey'] = self.survey.pk

        # Assert that we pass validation.
        serializer = serializers.SurveyResponseSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        # Assert that one response per fieldset is created.
        serializer.create(serializer.validated_data)
        self.assertEqual(models.UserResponse.objects.count(), 3)

        # Assert enough detail about one of the responses to verify the data has been
        # passed through.
        response = models.UserResponse.objects.first()
        self.assertEqual(response.survey, self.survey)
        self.assertEqual(response.fieldset, self.fieldset_one)
        self.assertEqual(response.answers, {'1': 'Friends'})

    def test_post_fail_validation(self):
        data = self.api_example_data('/forms/pk', 'post')['fields']
        data['survey'] = self.survey.pk

        # Change the submitted response to the third question so as to make it fail
        # validation.
        data['user_responses'][1]['answers']['3'] = 'Not a number'

        serializer = serializers.SurveyResponseSerializer(data=data)
        self.assertFalse(serializer.is_valid())

        field_errors = serializer.errors['user_responses'][1]['3']
        self.assertIn('A valid integer is required.', field_errors)
