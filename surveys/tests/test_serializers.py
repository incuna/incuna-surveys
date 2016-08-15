from collections import OrderedDict

from django.test import TestCase

from .utils import create_survey_data
from .. import serializers
from ..models import UserResponse


class TestSerializers(TestCase):
    @classmethod
    def setUpTestData(cls):
        create_survey_data(cls)

    def test_get(self):
        """Test the heavily nested SurveySerializer serializes data correctly."""
        serializer = serializers.SurveySerializer(instance=self.survey)
        data = serializer.data

        field_data = OrderedDict(
            [
                ('id', self.field.id),
                ('name', self.field.name),
                ('help_text', self.field.help_text),
                ('field_type', self.field.field_type),
                ('answers', self.field.answers),
                ('required', self.field.required)
            ]
        )
        self.assertEqual(data['fieldsets'][0]['fields'][0], field_data)

        fieldset_data = OrderedDict(
            [
                ('id', self.fieldset.id),
                ('name', self.fieldset.name),
                ('description', self.fieldset.description),
                ('fields', [field_data])
            ]
        )
        self.assertEqual(data['fieldsets'][0], fieldset_data)

        expected_data = {
            'name': self.survey.name,
            'description': self.survey.description,
            'url': self.survey.get_api_url(),
            'fieldsets': [fieldset_data]
        }

        self.assertEqual(expected_data, data)

    def test_post(self):
        data = {
            'survey': self.survey.pk,
            'user_responses': [
                {
                    'user_id': 'LeeroyJenkins',
                    'fieldset': self.fieldset.pk,
                    'answers': {str(self.field.pk): 1}
                }
            ]
        }

        serializer = serializers.SurveyResponseSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        serializer.create(serializer.validated_data)
        response = UserResponse.objects.first()
        self.assertEqual(response.survey, self.survey)
        self.assertEqual(response.fieldset, self.fieldset)
        self.assertEqual(response.user_id, data['user_responses'][0]['user_id'])
        self.assertEqual(response.answers, data['user_responses'][0]['answers'])
