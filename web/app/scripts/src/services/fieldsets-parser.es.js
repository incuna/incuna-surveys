/*
 *
 * This module parses a form API into an angular-formly array
 *
 */
export const FieldsetParserService = function (Templates) {
    return {
        parseFields: function (form) {
            let fields = [];

            fields[0] = {
                template: Templates.header,
                templateOptions: {
                    formName: form.name,
                    formDescription: form.description
                }
            };

            form.fieldsets.forEach((fieldset) => {
                let fieldGroup = [
                    {
                        template: Templates.fieldHeader,
                        templateOptions: {
                            fieldGroupName: fieldset.name,
                            fieldGroupDesc: fieldset.description
                        }
                    }
                ];


                fieldset.fields.forEach((field) => {
                    let fieldObject = {
                        key: field.id,
                        type: field.field_type,
                        templateOptions: {
                            fieldSetIndex: fieldset.id - 1,
                            choices: field.answers,
                            fieldOptions: {
                                help_text: field.help_text,
                                required: field.required,
                                label: field.name
                            }
                        }
                    };

                    fieldGroup.push(fieldObject);
                });


                fields.push({
                    fieldGroup
                });
            });

            return fields;

        },
        parseModel: function (form) {
            let model = [];

            form.fieldsets.forEach((fieldset, index) => {
                model.push({
                    fieldset: index + 1,
                    answers: {}
                });
            });

            return model;
        }
    }
};

export const module = [
    'Templates',
    FieldsetParserService
];

export default module;

