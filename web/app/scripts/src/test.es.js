// TODO: remove this file, it is only proof of concept

const apiDesc = {
            "name": "How have you been using the site?",
            "description": "Form description",
            "url": "http://localhost:8000/forms/1",
            "fieldsets": [
                {
                    "id": 1,
                    "name": "Free text field",
                    "description": "Some additional text expanding on the above",
                    "fields": [
                        {
                            "id": 1,
                            "name": "How did you discover the site?",
                            "help_text": "Search engine, friend...",
                            "field_type": "free_text",
                            "required": true,
                            "answers": []
                        }
                    ]
                },
                {
                    "id": 2,
                    "name": "Numeric fields",
                    "description": "Some additional text expanding on the above",
                    "fields": [
                        {
                            "id": 2,
                            "name": "What is answer to the ultimate question of life, the universe, and everything?",
                            "help_text": null,
                            "field_type": "number",
                            "required": false,
                            "answers": []
                        },
                        {
                            "id": 3,
                            "name": "How much percentage does it take?",
                            "help_text": null,
                            "field_type": "percentage",
                            "required": true,
                            "answers": []
                        }
                    ]
                },
                {
                    "id": 3,
                    "name": "Choice fields",
                    "description": "Some additional text expanding on the above",
                    "fields": [
                        {
                            "id": 4,
                            "name": "How many time do you visit the site per day?",
                            "help_text": "Choose a valid answer.",
                            "field_type": "radio",
                            "required": true,
                            "answers": ["One time", "Two times", "Three times or more"]
                        },
                        {
                            "id": 5,
                            "name": "Choose more than one answer.",
                            "help_text": null,
                            "field_type": "checkbox",
                            "required": false,
                            "answers": ["One time", "Two times", "Three times or more"]
                        }
                    ]
                }
            ]
        };

export const module = function () {
    angular.module('test-app', ['formly', 'incuna-surveys', 'checklist-model'])
        .controller('FormCtrl', [
            'formlyConfig',
            'FieldsetParserService',
            function (
                formlyConfig,
                FieldsetParserService
            ) {

                formlyConfig.setType({
                    name: 'free_text',
                    templateUrl: 'templates/incuna-surveys/fields/free-text.html'
                });

                formlyConfig.setType({
                    name: 'number',
                    templateUrl: 'templates/incuna-surveys/fields/number.html'
                });

                formlyConfig.setType({
                    name: 'percentage',
                    templateUrl: 'templates/incuna-surveys/fields/percentage.html'
                });

                formlyConfig.setType({
                    name: 'checkbox',
                    templateUrl: 'templates/incuna-surveys/fields/checkbox.html'
                });

                formlyConfig.setType({
                    name: 'radio',
                    templateUrl: 'templates/incuna-surveys/fields/radio.html'
                });

                this.fields = FieldsetParserService.parseFields(apiDesc);
                this.model = FieldsetParserService.parseModel(apiDesc);
            }]);
        

};

export default module;
