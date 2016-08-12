/*
 *
 * This module parses a form API into an angular-formly array
 *
 */
export const FieldsetParserService = function (Templates) {
    return {
        parseFieldsets: function (form) {
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
                            label: field.name,
                            fieldSetIndex: fieldset.id - 1,
                            choices: [
                                'One',
                                'Two',
                                'Three'
                            ]
                        }
                    };

                    fieldGroup.push(fieldObject);
                });


                fields.push({
                    fieldGroup
                });
            });


            return {
                fields
            };
        }
    }
};

export const module = [
    'Templates',
    FieldsetParserService
];

export default module;

