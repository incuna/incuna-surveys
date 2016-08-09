from collections import ChainMap


class BaseFieldGenerator(object):
    """
    A base class for generating dynamic fields.

    Creates and returns an instance of a field specified in the self.field_class
    attribute. By default, the created field is required.  Make sure to set the
    field_class attribute when overriding, otherwise your generator will be a bit useless.

    Methods:
    - get_field_kwargs - returns keyword arguments for the field based on an object
      instance.  (The instance is intended to be a SurveyField, which will specify
      the field's behaviour.)
    - generate_field - return an actual field instance.  The instance is given
      the kwargs from get_field_kwargs() but those can be overridden or added to by
      passing more to the generate_field() call.
    """
    def get_field_kwargs(self, instance):
        return {'required': instance.required}

    def generate_field(self, instance, **kwargs):
        field_kwargs = ChainMap(kwargs, self.get_field_kwargs(instance))
        return self.field_class(**field_kwargs)
