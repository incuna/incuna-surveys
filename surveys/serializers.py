from rest_framework import serializers

from . import models


class SurveyFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SurveyField
        fields = ['name', 'help_text', 'field_type', 'answers', 'required']


class SurveyFieldsetSerializer(serializers.ModelSerializer):
    fields = SurveyFieldSerializer(many=True)

    class Meta:
        model = models.SurveyFieldset
        fields = ['name', 'description', 'fields']


class SurveySerializer(serializers.ModelSerializer):
    fieldsets = SurveyFieldsetSerializer(many=True)

    class Meta:
        model = models.Survey
        fields = ['name', 'description', 'fieldsets']


class UserResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserResponse
        fields = ['fieldset', 'user_id', 'answers']


class SurveyResponseSerializer(serializers.Serializer):
    user_responses = UserResponseSerializer(many=True)
    survey = serializers.PrimaryKeyRelatedField(queryset=models.Survey.objects.all())

    class Meta:
        fields = ['survey', 'user_responses']

    def create(self, validated_data):
        response_data = validated_data['user_responses']
        responses = []
        for response in response_data:
            response['survey'] = validated_data['survey']
            responses.append(UserResponseSerializer(data=response).create(response))
        return responses
