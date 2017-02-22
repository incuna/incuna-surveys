import json

from rest_framework import serializers
from rest_framework.utils.encoders import JSONEncoder

from . import models


def json_decode(answers):
    return json.loads(json.dumps(answers, cls=JSONEncoder))


class SurveyFieldSerializer(serializers.ModelSerializer):
    """For a single field.  Nested into SurveyFieldsetSerializer."""
    class Meta:
        model = models.SurveyField
        fields = ['id', 'name', 'help_text', 'field_type', 'answers', 'required']


class SurveyFieldsetSerializer(serializers.ModelSerializer):
    """A complete fieldset.  Nested into SurveySerializer but also works alone."""
    fields = SurveyFieldSerializer(source='get_ordered_fields', many=True)

    class Meta:
        model = models.SurveyFieldset
        fields = ['id', 'name', 'description', 'fields']


class SurveySerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for a full survey."""
    fieldsets = SurveyFieldsetSerializer(source='get_ordered_fieldsets', many=True)

    class Meta:
        model = models.Survey
        fields = ['name', 'description', 'url', 'fieldsets', 'start_date', 'end_date']
        extra_kwargs = {
            'url': {'view_name': 'survey-form'},
        }


class SurveyResponseSerializer(serializers.Serializer):
    def to_representation(self, instance):
        if isinstance(instance, dict):
            return super(SurveyResponseSerializer, self).to_representation(instance)
        return {response.survey_id: response.answers for response in instance}

    def get_fields(self):
        """
        Dynamically generate the fields from the survey fieldsets.
        Returns a dictionary of {field_name: field_instance}.
        """
        survey = self.context['survey']
        return {
            str(fs.pk): FieldsetResponseSerializer(fieldset=fs, context=self.context)
            for fs in survey.get_ordered_fieldsets()
        }

    def create(self, validated_data):
        """
        Create all the individual UserResponse objects.

        We have to do it explicitly because this serializer doesn't have a model.
        DRF can only automatically create the nested models when they're foreign-keyed
        to by a main one.

        We also need to fill in the survey, which isn't supplied explicitly for each of
        the individual user response objects.
        """
        responses = list()
        survey = validated_data.pop('survey')
        user_id = validated_data.pop('user_id')
        for fieldset_pk, answers in validated_data.items():
            fieldset = survey.fieldsets.get(pk=fieldset_pk)
            responses.append(
                models.UserResponse.objects.create(
                    survey=survey,
                    user_id=user_id,
                    fieldset=fieldset,
                    answers=json_decode(answers),
                )
            )

        return responses


class FieldsetResponseSerializer(serializers.Serializer):
    def __init__(self, fieldset, *args, **kwargs):
        self.fieldset = fieldset
        super().__init__(*args, **kwargs)

    def get_fields(self):
        """
        Dynamically generate the fields from the fieldset fields.
        Returns a dictionary of {field_name: field_instance}.
        """
        return {
            str(field.pk): field.get_serializer_field()
            for field in self.fieldset.get_ordered_fields()
        }
