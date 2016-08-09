from django.apps import apps
from django.contrib.postgres.fields import ArrayField, JSONField
from django.db import models
from django.utils.translation import ugettext_lazy as _
from orderable.models import Orderable


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


class SurveyFieldset(Orderable):
    """
    A group of questions that make up a complete form.

    A SurveyFieldset can be 'activated' by the presenter. While active, it will be
    displayed on the iPads for users to respond to.
    """
    name = models.CharField(max_length=255)
    fields = models.ManyToManyField(
        SurveyField,
        related_name='fieldsets',
        through='SurveyFieldOrdering',
    )

    def __str__(self):
        return self.name


class SurveyFieldOrdering(Orderable):
    """
    A through table for SurveyFieldset and SurveyField, allowing fields to be ordered
    differently in each fieldset.
    """
    field = models.ForeignKey(SurveyField, on_delete=models.CASCADE)
    fieldset = models.ForeignKey(SurveyFieldset, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('field', 'fieldset')


class UserResponseQuerySet(models.QuerySet):
    def num_users(self):
        """Returns the number of distinct users who reported this set of answers."""
        return self.order_by().values('user_id').distinct().count()


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
    user_id = models.CharField(max_length=255)
    answers = JSONField()

    objects = UserResponseQuerySet.as_manager()

    class Meta:
        unique_together = ('fieldset', 'user_id')
