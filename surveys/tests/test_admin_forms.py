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
            'answers': '\r\n'.join(self.answers),
        }
        form = self.form(data)

        self.assertTrue(form.is_valid(), form.errors)
        self.assertEqual(form.cleaned_data['answers'], self.answers)

    def test_can_have_comma_in_answers(self):
        new_answers = ['a,comma, to test,'] + self.answers
        data = {
            'name': 'Is the answer "No"?',
            'field_type': 'radio',
            'answers': '\r\n'.join(new_answers),
        }
        form = self.form(data)

        self.assertTrue(form.is_valid(), form.errors)
        self.assertEqual(form.cleaned_data['answers'], new_answers)
