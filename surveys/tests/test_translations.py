from django.db import connection
from django.db.migrations.executor import MigrationExecutor
from django.test import TestCase
from django.test import TransactionTestCase

from surveys.models import SurveyField


class MigrationsTestCase(TransactionTestCase):
    app = None
    migrate_from = None
    migrate_to = None

    def setUp(self):
        assert self.migrate_from and self.migrate_to, \
            "TestCase '{}' must define migrate_from and migrate_to properties".format(
                type(self).__name__)
        self.migrate_from = [(self.app, self.migrate_from)]
        self.migrate_to = [(self.app, self.migrate_to)]
        executor = MigrationExecutor(connection)

        # Reverse to the original migration
        executor.migrate(self.migrate_from)

        old_apps = executor.loader.project_state(self.migrate_from).apps

        self.setUpBeforeMigration(old_apps)

        # Run the migration to test

        executor = MigrationExecutor(connection)
        executor.migrate(self.migrate_to)

        self.apps = executor.loader.project_state(self.migrate_to).apps

        self.setUpAfterMigration(self.apps)

    def setUpBeforeMigration(self, apps):
        pass

    def setUpAfterMigration(self, apps):
        pass


class TestArrayTranslationMigration(MigrationsTestCase):
    app = 'surveys'
    migrate_from = '0011_create_translation_models'
    migrate_to = '0013_remove_old_fields'

    def setUpBeforeMigration(self, apps):
        self.SurveyField = apps.get_model(self.app, 'SurveyField')
        self.survey_field = self.SurveyField.objects.create(
            name='Name',
            answers=['answer_1', 'answer_2'],
        )

    def setUpAfterMigration(self, apps):
        SurveyFieldAfter = apps.get_model(self.app, 'SurveyField')
        self.survey_field_after = SurveyFieldAfter.objects.get(id=self.survey_field.id)

    def test_report_migration(self):
        # There is an issue where the models are not fully generated during
        # the test setup. Thus we must access instance.translations to check
        # the values
        self.assertEqual(
            self.survey_field.answers,
            self.survey_field_after.translations.first().answers,
        )


class TestArrayTranslations(TestCase):

    def setUp(self):
        self.english_answers = ('answer_1', 'answer_2')
        self.field = SurveyField.objects.create(answers=self.english_answers)

    def test_full_assignment_works(self):
        french_answers = ['Sacre Bleu!', 'answer_2']
        self.field.set_current_language('fr')
        self.field.answers = french_answers
        self.assertEqual(self.field.answers, french_answers)
        self.field.set_current_language('en')
        self.assertEqual(self.field.answers, self.english_answers)

    def test_partial_assignment_fails(self):
        self.field.set_current_language('es')
        with self.assertRaises(TypeError):
            self.field.answers[0] = 'Buenos Dias!'
