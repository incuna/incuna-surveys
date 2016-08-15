from django.conf.urls import include, url
from django.contrib import admin

from .. import urls as survey_urls

urlpatterns = [
    url(r'', include(survey_urls)),
    url(r'^admin/', include(admin.site.urls)),
]
