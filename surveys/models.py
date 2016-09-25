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
        blank=True,
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

    def get_ordered_fields(self):
        return self.fields.order_by('surveyfieldordering__sort_order')


class Survey(models.Model):
    """An entire survey form.  Contains one or more ordered fieldsets."""
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    fieldsets = models.ManyToManyField(
        SurveyFieldset,
        related_name='surveys',
        through='SurveyFieldsetOrdering',
    )
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.name

    def get_api_url(self):
        return drf_reverse('survey-form', kwargs={'pk': self.pk})

    def get_ordered_fieldsets(self):
        return self.fieldsets.order_by('surveyfieldsetordering__sort_order')


class SurveyFieldOrdering(Orderable):
    """
    A through table for SurveyFieldset and SurveyField, allowing fields to be ordered
    differently in each fieldset.
    """
    field = models.ForeignKey(SurveyField, on_delete=models.CASCADE)
    fieldset = models.ForeignKey(SurveyFieldset, on_delete=models.CASCADE)

    class Meta(Orderable.Meta):
        unique_together = ('field', 'fieldset')


class SurveyFieldsetOrdering(Orderable):
    """
    A through table for SurveyFieldset and Survey, allowing fieldsets to be arranged
    in any order in the survey.
    """
    fieldset = models.ForeignKey(SurveyFieldset, on_delete=models.CASCADE)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)

    class Meta(Orderable.Meta):
        unique_together = ('survey', 'fieldset')


class UserResponseQuerySet(models.QuerySet):
    def num_users(self):
        """Returns the number of distinct users who reported this set of answers."""
        return self.order_by().values('user_id').distinct().count()

    def _build_latest_dict(self, data_values):
        """
        Turns a values() list into an organised dict suitable for finding the latest
        entry each user_id submitted.

        Builds and returns a nested dictionary:
          {<survey>: {<user_id>: {<fieldset>: {
            answers: <answers>, date_created: <date_created>
          }}}}

        Expects the following values: survey__pk, fieldset__pk, user_id, answers,
        date_created.  It also expects the entries to be sorted by date_created.

        Why it works:
        - Loop through the list.  Build a nested dictionary that relates a fieldset and
          a user_id to the user's answers.
        - Use defaultdict so we don't have to check if <user_id> is already in the
          results before assigning values to the <fieldset> entry.
        - Because we're traversing the list in order from least to most recent, the
          most recently accessed answers for each user are the 'correct' latest ones,
          so just overwrite whatever's already in the slot.
        - Return the built dictionary.
        """
        results = defaultdict(lambda: defaultdict(dict))
        for entry in data_values:
            user_id = entry['user_id']
            fieldset = entry['fieldset__pk']
            survey = entry['survey__pk']
            results[survey][user_id][fieldset] = {
                'answers': entry['answers'],
                'date_created': entry['date_created'],
            }

        return results

    def latest_responses(self):
        """
        Returns the latest UserResponse per user per fieldset per survey.

        The results are delivered as a dictionary:
          {<survey>: {<user_id>: {<fieldset>: {
            answers: <answers>, date_created: <date_created>
          }}}}
        """
        qs = self.order_by('date_created')
        raw_data = qs.values(
            'survey__pk',
            'fieldset__pk',
            'user_id',
            'answers',
            'date_created',
        )
        return self._build_latest_dict(raw_data)

    def latest_for_survey(self, survey):
        """
        Returns the latest UserResponse per user per fieldset in this survey.

        The results are delivered as a dictionary:
          {<user_id>: {<fieldset>: {
            answers: <answers>, date_created: <date_created>
          }}}

        Calls latest_per_user on a queryset filtered to a single survey.  The reason
        for doing this over calling latest_per_user directly and retrieving that
        survey's dictionary entry is that filtering the queryset first means a smaller
        dataset to operate on in memory.

        Returns {} gracefully if the survey has no responses thanks to defaultdict.
        """
        return self.filter(survey=survey).latest_responses()[survey.pk]

    def latest_for_user(self, survey, user_id):
        """
        Returns the latest UserResponse per fieldset for this user and survey.

        The results are delivered as a dictionary:
          {<fieldset>: {
            answers: <answers>, date_created: <date_created>
          }}

        This method exists for the same reason as latest_for_survey - filtering the
        queryset first reduces the amount of data pulled into memory.

        Returns {} gratefully if the user or survey have no responses thanks to
        defaultdict.
        """
        return self.filter(user_id=user_id).latest_for_survey(survey)[user_id]


class UserResponse(models.Model):
    """
    A particular user's answers to a single SurveyFieldset.

    The user's responses are stored as a dictionary in a JSONField:
        {<field pk>: [list, of, answers]}

    To remain generic, we store the user id as a CharField rather than a ForeignKey to
    AUTH_USER_MODEL.  This is in order to support anonymous surveys, where users don't
    have to register, and might be identified by a session ID instead.
    """
    survey = models.ForeignKey(Survey)
    fieldset = models.ForeignKey(SurveyFieldset)
    user_id = models.CharField(max_length=255)
    date_created = models.DateTimeField(default=timezone.now)
    answers = JSONField()

    objects = UserResponseQuerySet.as_manager()
