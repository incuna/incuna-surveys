const apiDesc = {
    /* jscs:disable disallowQuotedKeysInObjects */
    'name': 'How have you been using the site?',
    'description': 'Form description',
    'url': 'http://localhost:8000/forms/1',
    'fieldsets': [
        {
            'id': 1,
            'name': 'Free text field',
            'description': 'Some additional text expanding on the above',
            'fields': [
                {
                    'id': 1,
                    'name': 'How did you discover the site?',
                    'help_text': 'Search engine, friend...',
                    'field_type': 'free_text',
                    'required': true,
                    'answers': []
                }
            ]
        },
        {
            'id': 2,
            'name': 'Numeric fields',
            'description': 'Some additional text expanding on the above',
            'fields': [
                {
                    'id': 2,
                    'name': 'What is answer to the ultimate question of life, the universe, and everything?',
                    'help_text': null,
                    'field_type': 'number',
                    'required': false,
                    'answers': []
                },
                {
                    'id': 3,
                    'name': 'How much percentage does it take?',
                    'help_text': null,
                    'field_type': 'percentage',
                    'required': true,
                    'answers': []
                }
            ]
        },
        {
            'id': 3,
            'name': 'Choice fields',
            'description': 'Some additional text expanding on the above',
            'fields': [
                {
                    'id': 4,
                    'name': 'How many time do you visit the site per day?',
                    'help_text': 'Choose a valid answer.',
                    'field_type': 'radio',
                    'required': true,
                    'answers': ['One time', 'Two times', 'Three times or more']
                },
                {
                    'id': 5,
                    'name': 'Choose more than one answer.',
                    'help_text': null,
                    'field_type': 'checkbox',
                    'required': false,
                    'answers': ['One time', 'Two times', 'Three times or more']
                }
            ]
        }
    ]
    /* jscs:enable disallowQuotedKeysInObjects */
};

angular.module('test-app', ['incuna-surveys'])
    .controller('FormCtrl', [
        'formlyConfig',
        'FieldsParser',
        function (
            formlyConfig,
            FieldsetParserService
        ) {

            this.fields = FieldsetParserService.parseFields(apiDesc);
            this.model = FieldsetParserService.parseModel(apiDesc);
        }]);
