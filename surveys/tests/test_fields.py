from django.test import TestCase

from .. import fields


class TestArrayFieldTextarea(TestCase):
    field_class = fields.ArrayFieldTextarea

    def test_input_transform(self):
        """Assert that _input_transform turns one delimiter into another in a string."""
        delimiter_newline = '\r\n'
        delimiter_array = ','
        text = 'I{de}am{de}to{de}be{de}transformed'

        input_value = text.format(de=delimiter_newline)
        actual_input = self.field_class._input_transform(input_value)

        self.assertEqual(actual_input, text.format(de=delimiter_array))

    def test_output_transform(self):
        """Assert that _output_transform turns one delimiter into another in a string."""
        delimiter_array = ','
        delimiter_newline = '\r\n'
        text = 'I{de}am{de}to{de}be{de}transformed'

        output_value = text.format(de=delimiter_array)
        actual_output = self.field_class._output_transform(output_value)

        self.assertEqual(actual_output, text.format(de=delimiter_newline))

    def test_output_transform_list(self):
        """Assert that _output_transform deals gracefully with list input."""
        delimiter_newline = '\r\n'
        text = ['I', 'am', 'to', 'be' 'transformed']

        transformed_value = self.field_class._output_transform(text)
        self.assertEqual(transformed_value, delimiter_newline.join(text))
