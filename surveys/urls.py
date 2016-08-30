from django.conf.urls import url

from . import views_api


urlpatterns = [
    url(r'^forms/?$', views_api.SurveyListView.as_view(), name='survey-forms'),
    url(r'^forms/(?P<pk>\d+)/?$', views_api.SurveyView.as_view(), name='survey-form'),
    url(
        r'^forms/(?P<pk>\d+)/respond/(?P<user_id>[^/]+)/?$',
        views_api.SurveyGetLatestCreateView.as_view(),
        name='survey-latest',
    ),
    url(
        r'^forms/(?P<pk>\d+)/respond/(?P<user_id>[^/]+)/create/?$',
        views_api.SurveyCreateView.as_view(),
        name='survey-post',
    ),
]
