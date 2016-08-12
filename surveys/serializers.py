from rest_framework import serializers

from . import models


class SurveyFieldSerializer(serializers.ModelSerializer):
    """For a single field.  Nested into SurveyFieldsetSerializer."""
    class Meta:
        model = models.SurveyField
        fields = ['pk', 'name', 'help_text', 'field_type', 'answers', 'required']


class SurveyFieldsetSerializer(serializers.ModelSerializer):
    """A complete fieldset.  Nested into SurveySerializer but also works alone."""
    fields = SurveyFieldSerializer(many=True)

    class Meta:
        model = models.SurveyFieldset
        fields = ['pk', 'name', 'description', 'fields']


class SurveySerializer(serializers.ModelSerializer):
    """Serializer for a full survey."""
    fieldsets = SurveyFieldsetSerializer(many=True)

    class Meta:
        model = models.Survey
        fields = ['name', 'description', 'fieldsets']


class UserResponseSerializer(serializers.ModelSerializer):
    """
    Serializer for a user's response to one fieldset, but without a survey required.

    Intended only for use as nested into SurveyResponseSerializer.
    """
    class Meta:
        model = models.UserResponse
        fields = ['fieldset', 'user_id', 'answers']


class SurveyResponseSerializer(serializers.Serializer):
    """Serializer for a user's answers to a whole survey."""
    user_responses = UserResponseSerializer(many=True)
    survey = serializers.PrimaryKeyRelatedField(queryset=models.Survey.objects.all())

    class Meta:
        fields = ['survey', 'user_responses']

    def create(self, validated_data):
        """
        Create all the individual UserResponse objects using the UserResponseSerializer.

        We have to do it explicitly because this serializer doesn't have a model.
        DRF can only automatically create the nested models when they're foreign-keyed
        to by a main one.

        We also need to fill in the survey, which isn't supplied explicitly for each of
        the individual user response objects.
        """
        response_data = validated_data['user_responses']
        responses = []

        for response in response_data:
            response['survey'] = validated_data['survey']
            responses.append(UserResponseSerializer(data=response).create(response))

        return responses
