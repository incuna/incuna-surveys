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
        latest_for_user = self.get_queryset().latest_for_user(self.survey, self.user_id)
        if not bool(latest_for_user):
            return None
        data = {}
        # Trim down the dictionary returned so it's just {<fieldset_pk>: <answers>}
        for fieldset_pk, entry in latest_for_user.items():
            data[str(fieldset_pk)] = entry['answers']
        return data

    def retrieve(self, request, *args, **kwargs):
        data = self.get_data()
        serializer = self.get_serializer(data)
        return Response(serializer.data)
