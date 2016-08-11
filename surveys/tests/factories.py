import factory
from django.contrib.auth import get_user_model

from .. import models


class UserFactory(factory.DjangoModelFactory):
    username = factory.Sequence('user{}'.format)
    email = factory.Sequence('email{}@example.com'.format)
    is_active = True

    class Meta:
        model = get_user_model()

    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        # By using this method, password can never be set to `None`!
        self.raw_password = 'password' if extracted is None else extracted
        self.set_password(self.raw_password)
        if create:
            self.save()


class SurveyFieldFactory(factory.DjangoModelFactory):
    name = factory.Sequence('SurveyField {}'.format)

    class Meta:
        model = models.SurveyField


class SurveyFieldsetFactory(factory.DjangoModelFactory):
    name = factory.Sequence('SurveyFieldset {}'.format)

    class Meta:
        model = models.SurveyFieldset


class SurveyFieldOrderingFactory(factory.DjangoModelFactory):
    field = factory.SubFactory(SurveyFieldFactory)
    fieldset = factory.SubFactory(SurveyFieldsetFactory)

    class Meta:
        model = models.SurveyFieldOrdering


class SurveyFactory(factory.DjangoModelFactory):
    name = factory.Sequence('Survey {}'.format)

    class Meta:
        model = models.Survey


class SurveyFieldsetOrderingFactory(factory.DjangoModelFactory):
    survey = factory.SubFactory(SurveyFactory)
    fieldset = factory.SubFactory(SurveyFieldsetFactory)

    class Meta:
        model = models.SurveyFieldsetOrdering


class UserResponseFactory(factory.DjangoModelFactory):
    survey = factory.SubFactory(SurveyFactory)
    fieldset = factory.SubFactory(SurveyFieldsetFactory)
    user_id = factory.Sequence('Session ID {}'.format)
    answers = [0]

    class Meta:
        model = models.UserResponse
