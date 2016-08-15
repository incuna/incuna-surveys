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
                    template: '<label>{{ to.label }}</label><input type="text" ng-model="model[to.fieldSetIndex].answers[options.key]">'
                });

                formlyConfig.setType({
                    name: 'number',
                    template: '<label>{{ to.label }}</label><input type="text" ng-model="model[to.fieldSetIndex].answers[options.key]">'
                });

                formlyConfig.setType({
                    name: 'percentage',
                    template: '<label>{{ to.label }}</label><input type="text" ng-model="model[to.fieldSetIndex].answers[options.key]">'
                });

                formlyConfig.setType({
                    name: 'checkbox',
                    template: '<label>{{ to.label }}</label><label ng-repeat="choice in to.choices">{{ choice }}<input type="checkbox" checklist-model="model[to.fieldSetIndex].answers[options.key]" checklist-value="choice"></label ng-repeat>'
                });

                formlyConfig.setType({
                    name: 'radio',
                    template: '<label>{{ to.label }}</label><input type="text" ng-model="model[to.fieldSetIndex].answers[options.key]">'
                });

//                this.model = [
//                    {
//                        fieldset: 1,
//                        answers: {}
//                    },
//                    {
//                        fieldset: 2,
//                        answers: {}
//                    },
//                    {
//                        fieldset: 3,
//                        answers: {}
//                    }
//                ];

                this.fields = FieldsetParserService.parseFields(apiDesc);
                this.model = FieldsetParserService.parseModel(apiDesc);

                /*this.fields = [
                    {
                        template: '<h1>{{ to.formTitle }}</h1><h2>{{ to.formDescription }}</h2>',
                        templateOptions: {
                            formTitle: apiDesc.name,
                            formDescription: apiDesc.description
                        }
                    },
                    {
                        fieldGroup: [
                            {
                                template: '<h3>{{ to.fieldGroupTitle }}</h3><h4>{{ to.fieldGroupDesc }}</h4>',
                                templateOptions: {
                                    fieldGroupTitle: apiDesc.fieldsets[0].name,
                                    fieldGroupDesc: apiDesc.fieldsets[0].description
                                },
                            },
                            {
                                key: apiDesc.fieldsets[0].fields[0].id,
                                type: apiDesc.fieldsets[0].fields[0].field_type,
                                templateOptions: {
                                    label: 'Blabla',
                                    index: apiDesc.fieldsets[0].id - 1
                                },
                            }
                        ]
                    },
                ];*/
            }]);
        

};

export default module;
