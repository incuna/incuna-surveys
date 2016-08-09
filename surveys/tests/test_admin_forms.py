from django.test import TestCase

from .. import admin_forms


class TestSurveyFieldForm(TestCase):
    form = admin_forms.SurveyFieldForm
    answers = ['Yes', 'No']

    def test_render_answers(self):
        form = self.form(initial={'answers': self.answers})

        html = form['answers'].as_widget()
        self.assertIn('\r\n'.join(self.answers), html)

    def test_validation(self):
        data = {
            'name': 'Is the answer "No"?',
            'field_type': 'radio',
            'answers': ','.join(self.answers),
        }
        form = self.form(data)

        self.assertTrue(form.is_valid(), form.errors)
        self.assertEqual(form.cleaned_data['answers'], self.answers)
