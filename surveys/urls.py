from django.conf.urls import url

from . import views_api


urlpatterns = [
    url(r'^forms/(?P<pk>\d+)/?$', views_api.SurveyView.as_view(), name='survey-form'),
    url(
        r'^forms/(?P<pk>\d+)/respond/?$',
        views_api.SurveyPostView.as_view(),
        name='survey-post',
    ),
]
