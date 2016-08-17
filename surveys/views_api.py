from rest_framework import generics
from rest_framework.generics import get_object_or_404

from .models import Survey
from .serializers import SurveyResponseSerializer, SurveySerializer


class SurveyView(generics.RetrieveAPIView):
    """Display a survey to the user."""
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer


class SurveyPostView(generics.CreateAPIView):
    serializer_class = SurveyResponseSerializer

    def dispatch(self, request, *args, **kwargs):
        survey_pk = kwargs.pop('pk')
        self.survey = get_object_or_404(Survey.objects.all(), pk=survey_pk)
        return super().dispatch(request, *args, **kwargs)

    def get_serializer(self, *args, **kwargs):
        kwargs['data']['survey'] = self.survey.pk
        serializer = super().get_serializer(*args, **kwargs)
        # serializer.survey = self.survey.pk
        return serializer
