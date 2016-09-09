from collections import defaultdict

from rest_framework import generics
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from .models import Survey, UserResponse
from .serializers import SurveyResponseSerializer, SurveySerializer


class SurveyListView(generics.ListAPIView):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer


class SurveyView(generics.RetrieveAPIView):
    """Display a survey to the user."""
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer


class SurveyCreateMixin:
    serializer_class = SurveyResponseSerializer

    def dispatch(self, request, *args, **kwargs):
        survey_pk = kwargs.get('pk')
        self.user_id = kwargs.get('user_id')
        self.survey = get_object_or_404(Survey.objects.all(), pk=survey_pk)
        return super().dispatch(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(survey=self.survey, user_id=self.user_id)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['survey'] = self.survey
        return context


class SurveyCreateView(SurveyCreateMixin, generics.CreateAPIView):
    pass


class SurveyGetLatestCreateView(
        SurveyCreateMixin,
        generics.RetrieveAPIView,
        generics.CreateAPIView):
    serializer_class = SurveyResponseSerializer
    queryset = UserResponse.objects.all()

    def get_data(self):
        """Get the latest data for the user and ensure all fields have a value"""
        latest_for_user = self.get_queryset().latest_for_user(self.survey, self.user_id)
        data = defaultdict(dict)
        for fieldset in self.survey.get_ordered_fieldsets():
            try:
                answers = latest_for_user[fieldset.pk]['answers']
            except KeyError:
                answers = {}

            for field in fieldset.get_ordered_fields():
                key = str(field.pk)
                if key not in answers:
                    # Set the fields initial value for any missing fields.
                    answers[key] = field.get_serializer_field().get_initial()

            data[str(fieldset.pk)] = answers

        return data

    def retrieve(self, request, *args, **kwargs):
        data = self.get_data()
        serializer = self.get_serializer(data)
        return Response(serializer.data)
