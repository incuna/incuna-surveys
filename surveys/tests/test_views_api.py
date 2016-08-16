from .utils import create_survey_data, RequestTestCase
from .. import views_api
from ..serializers import SurveySerializer


class TestSurveyView(RequestTestCase):
    @classmethod
    def setUpTestData(cls):
        create_survey_data(cls)

    def test_get(self):
        """Test that the view can retrieve a survey and return correct JSON."""
        view = views_api.SurveyView.as_view()
        request = self.create_request()
        response = view(request, pk=self.survey.pk)

        self.assertEqual(response.status_code, 200)

        # The data is asserted thoroughly in the serializer test, so we'll just check
        # that it's the same data here and hasn't been tampered with.  That way, if the
        # serializer is broken, only that test should fail, and this test will be
        # unconcerned by changes to the serializer format.
        expected_data = SurveySerializer(
            instance=self.survey,
            context={'request': request},
        ).data
        self.assertEqual(response.data, expected_data)
