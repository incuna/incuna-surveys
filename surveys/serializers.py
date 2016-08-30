from rest_framework import serializers

from . import models


class SurveyFieldSerializer(serializers.ModelSerializer):
    """For a single field.  Nested into SurveyFieldsetSerializer."""
    class Meta:
        model = models.SurveyField
        fields = ['id', 'name', 'help_text', 'field_type', 'answers', 'required']


class SurveyFieldsetSerializer(serializers.ModelSerializer):
    """A complete fieldset.  Nested into SurveySerializer but also works alone."""
    fields = SurveyFieldSerializer(many=True)

    class Meta:
        model = models.SurveyFieldset
        fields = ['id', 'name', 'description', 'fields']


class SurveySerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for a full survey."""
    fieldsets = SurveyFieldsetSerializer(many=True)

    class Meta:
        model = models.Survey
        fields = ['name', 'description', 'url', 'fieldsets', 'start_date', 'end_date']
        extra_kwargs = {
            'url': {'view_name': 'survey-form'},
        }


class FieldValidationSerializer(serializers.Serializer):
    """
    Gets initialised with some dynamic fields based on a given fieldset.

    Doesn't actually create anything or relate directly to an endpoint, but is used
    to verify validation for submitted answers.
    """
    def __init__(self, fieldset, *args, **kwargs):
        super().__init__(*args, **kwargs)

        fields = fieldset.fields.all()
        for field in fields:
            self.fields[str(field.pk)] = field.get_serializer_field()


class UserResponseSerializer(serializers.ModelSerializer):
    """
    Serializer for a user's response to one fieldset, but without a survey required.

    Intended only for use as nested into SurveyResponseSerializer.
    """
    user_id = serializers.CharField(required=False)

    class Meta:
        model = models.UserResponse
        fields = ['fieldset', 'user_id', 'answers']

    def validate(self, attrs):
        attrs = super().validate(attrs)

        fieldset = attrs['fieldset']
        validator = FieldValidationSerializer(
            fieldset=fieldset,
            data=attrs['answers'],
        )

        validator.is_valid(raise_exception=True)
        return attrs


class SurveyResponseSerializer(serializers.Serializer):
    """Serializer for a user's answers to a whole survey."""
    user_responses = UserResponseSerializer(many=True)

    class Meta:
        fields = ['user_responses']

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
            response['user_id'] = validated_data['user_id']
            responses.append(UserResponseSerializer(data=response).create(response))

        return validated_data
