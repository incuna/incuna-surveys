from django.forms import Textarea


ARRAY_FIELD_DELIMITER = ','


class ArrayFieldTextarea(Textarea):
    """
    This is a Textarea representing an ArrayField.

    A user can enter a list of values by separating them with newlines.
    """
    @staticmethod
    def _input_transform(value):
        """
        Switch from newline delimiters (entered in the widget by the user) to the
        internal ArrayField delimiter used by Postgres.
        """
        if isinstance(value, str):
            value = ARRAY_FIELD_DELIMITER.join(value.splitlines())
        return value

    @staticmethod
    def _output_transform(value):
        """
        Switch from the internal ArrayField delimiter used by Postgres to newlines.
        We want to handle both list and string input.
        """
        if isinstance(value, str):
            value = value.split(ARRAY_FIELD_DELIMITER)
        if isinstance(value, list):
            value = '\r\n'.join(value)
        return value

    def render(self, name, value, attrs=None):
        """
        The value should be rendered as a single string, joined together by newlines.
        """
        value = self._output_transform(value)
        return super().render(name, value, attrs)

    def value_from_datadict(self, data, files, name):
        """Turn a newline-separated list into an actual Python list."""
        value = data.get(name, None)
        return self._input_transform(value)
