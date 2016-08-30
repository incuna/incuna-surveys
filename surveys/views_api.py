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


class SurveyCreateView(SurveyCreateMixin, generics.CreateAPIView):
    pass


class SurveyGetLatestCreateView(
        SurveyCreateMixin,
        generics.RetrieveAPIView,
        generics.CreateAPIView):
    queryset = UserResponse.objects.all()

    def get(self, request, *args, **kwargs):
        data = self.get_queryset().latest_for_user(self.survey, self.user_id)
        # Trim down the dictionary returned so it's just {<fieldset_pk>: <answers>}
        for fieldset_pk, entry in data.items():
            data[fieldset_pk] = entry['answers']
        return Response(data)
