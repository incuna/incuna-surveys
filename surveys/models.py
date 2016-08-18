from collections import defaultdict

from django.apps import apps
from django.contrib.postgres.fields import ArrayField, JSONField
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from orderable.models import Orderable
from rest_framework.reverse import reverse as drf_reverse

survey_config = apps.get_app_config('surveys')


class SurveyField(models.Model):
    """
    A single question that will appear as part of a form displayed to the user.

    This class behaves as a specification and doesn't store any user responses. It is
    used to build the form and to provide an admin interface for creating questionnaires.
    The user never really gets to interact with it individually.

    A SurveyField is built around a list of possible answers.  If the list is empty,
    this indicates a free text field or some similar user-submitted value.
    """
    FIELD_TYPE_CHOICES = survey_config.field_type_choices

    name = models.CharField(max_length=255, unique=True)
    help_text = models.CharField(max_length=255, blank=True)
    field_type = models.CharField(
        max_length=255,
        default=FIELD_TYPE_CHOICES[0][0],
        choices=FIELD_TYPE_CHOICES,
    )
    answers = ArrayField(
        base_field=models.CharField(max_length=255),
        default=[],
        help_text=_(
            'For choice fields only. Enter one or more answers, separated by newlines.'
        ),
    )
    required = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    @property
    def key(self):
        """An id suitable for use in an HTML form."""
        return 'question-{}'.format(self.pk)

    def get_form_field(self):
        generator_class = survey_config.form_field_factories[self.field_type]
        return generator_class().generate_field(self)

    def get_serializer_field(self):
        generator_class = survey_config.serializer_field_factories[self.field_type]
        return generator_class().generate_field(self)


class SurveyFieldset(models.Model):
    """A group of questions that make up a complete form."""
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    fields = models.ManyToManyField(
        SurveyField,
        related_name='fieldsets',
        through='SurveyFieldOrdering',
    )

    def __str__(self):
        return self.name


class Survey(models.Model):
    """An entire survey form.  Contains one or more ordered fieldsets."""
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    fieldsets = models.ManyToManyField(
        SurveyFieldset,
        related_name='surveys',
        through='SurveyFieldsetOrdering',
    )

    def __str__(self):
        return self.name

    def get_api_url(self):
        return drf_reverse('survey-form', kwargs={'pk': self.pk})


class SurveyFieldOrdering(Orderable):
    """
    A through table for SurveyFieldset and SurveyField, allowing fields to be ordered
    differently in each fieldset.
    """
    field = models.ForeignKey(SurveyField, on_delete=models.CASCADE)
    fieldset = models.ForeignKey(SurveyFieldset, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('field', 'fieldset')


class SurveyFieldsetOrdering(Orderable):
    """
    A through table for SurveyFieldset and Survey, allowing fieldsets to be arranged
    in any order in the survey.
    """
    fieldset = models.ForeignKey(SurveyFieldset, on_delete=models.CASCADE)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('survey', 'fieldset')


class UserResponseQuerySet(models.QuerySet):
    def num_users(self):
        """Returns the number of distinct users who reported this set of answers."""
        return self.order_by().values('user_id').distinct().count()

    def latest_per_user(self, survey):
        """
        Returns the latest UserResponse per user per fieldset in this survey.

        The results are delivered as a dictionary:
          {<user_id>: {<fieldset>: <answers>}}

        Works by:
        - Filter the queryset by the given survey and sort it by date_created ascending.
        - Retrieve only the relevant data using `values()` to trim down memory footprint.
        - Loop through the list.  Build a nested dictionary that relates a fieldset and
          a user_id to the user's answers.  Overwrite any previous setting.
        - Because we're traversing the list in order from least to most recent, the
          most recently accessed answers for each user are the 'correct' latest ones.
        - Return the built dictionary.
        """
        qs = self.filter(survey=survey).order_by('date_created')
        raw_data = qs.values('fieldset__pk', 'user_id', 'answers')

        # Build a dictionary of dictionaries:
        #  {<user_id>: {<fieldset>: <answers>}}
        # Use defaultdict so we don't have to check if <user_id> is already in the
        # results before assigning values to the <fieldset> entry.
        results = defaultdict(dict)
        for entry in raw_data:
            user_id = entry['user_id']
            fieldset = entry['fieldset__pk']
            results[user_id][fieldset] = entry['answers']

        return results


class UserResponse(models.Model):
    """
    A particular user's answers to a single SurveyFieldset.

    The user's responses are stored as a dictionary in a JSONField:
        {<field pk>: [list, of, answers]}

    To remain generic, we store the user id as a CharField rather than a ForeignKey to
    AUTH_USER_MODEL.  This is in order to support anonymous surveys, where users don't
    have to register, and might be identified by a session ID instead.
    """
    fieldset = models.ForeignKey(SurveyFieldset)
    survey = models.ForeignKey(Survey)
    user_id = models.CharField(max_length=255)
    date_created = models.DateField(default=timezone.now)
    answers = JSONField()

    objects = UserResponseQuerySet.as_manager()
