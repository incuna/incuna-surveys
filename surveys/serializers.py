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


class SurveyResponseSerializer(serializers.Serializer):
    fieldsets = UserResponseSerializer(many=True)
