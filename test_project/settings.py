import os

import dj_database_url
from django.utils.translation import ugettext_lazy as _

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API_DESCRIPTION_DIR = os.path.join(BASE_DIR, 'api-description')

DEBUG = True
ALLOWED_HOSTS = []
ROOT_URLCONF = 'surveys.tests.urls'
STATIC_URL = '/static/'

SECRET_KEY = 'not-for-production'
PASSWORD_HASHERS = ('django.contrib.auth.hashers.MD5PasswordHasher',)

DATABASES = {
    'default': dj_database_url.config(default='postgres://localhost/surveys')
}
DEFAULT_FILE_STORAGE = 'inmemorystorage.InMemoryStorage'

INSTALLED_APPS = (
    'test_project',
    'surveys',
    'surveys.tests',

    'orderable',
    'parler',
    'rest_framework',

    'corsheaders',

    # Work around 'relation does not exist' errors by ordering the installed apps:
    #   contenttypes -> auth -> everything else.
    # See: https://code.djangoproject.com/ticket/10827#comment:12
    #      http://stackoverflow.com/q/29689365
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'django.contrib.admin',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
)
MIDDLEWARE_CLASSES = (
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.locale.LocaleMiddleware',
)

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.request',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

TEST_RUNNER = 'test_project.test_runner.Runner'

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

LANGUAGE_CODE = 'en'

LANGUAGES = (
    ('en', _("English")),
    ('fr', _("French")),
    ('es', _("Spanish")),
)

PARLER_LANGUAGES = {
    None: (
        {'code': 'en'},
        {'code': 'fr'},
        {'code': 'es'},
    ),
}
