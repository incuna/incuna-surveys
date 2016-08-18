/*
 *
 * This module parses a form API into an angular-formly array
 *
 */

import { angular } from '../libraries';

import FieldsConfigModule from 'fields-config';

export const moduleProperties = {
    moduleName: 'incuna-surveys.field-parser',
    componentName: 'FieldsParser'
};

const module = angular.module(moduleProperties.moduleName, [
    FieldsConfigModule.moduleName
]);

module.service(moduleProperties.componentName, [
    FieldsConfigModule.componentName,
    function (
        FieldsConfig
    ) {
        return {
            parseFields: function (form) {
                let fields = [];

                fields[0] = {
                    templateUrl: FieldsConfig.headerTemplateUrl,
                    templateOptions: {
                        formName: form.name,
                        formDescription: form.description
                    }
                };

                form.fieldsets.forEach((fieldset) => {
                    let fieldGroup = [
                        {
                            templateUrl: FieldsConfig.fieldsetHeaderTemplateUrl,
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
                                    // jscs:disable disallowQuotedKeysInObjects
                                    'help_text': field.help_text,
                                    required: field.required,
                                    label: field.name
                                    // jscs:enable disallowQuotedKeysInObjects
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
    }
]);

export default moduleProperties;
