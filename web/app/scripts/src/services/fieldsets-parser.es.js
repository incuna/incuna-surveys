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
        this.parseFields = function (form) {
            let fields = [];

            form.fieldsets.forEach((fieldset) => {
                let fieldGroup = 
                    {
                        wrapper: 'panel',
                        templateOptions: fieldset,
                        fieldGroup: []
                    }
                ;

                fieldset.fields.forEach((field) => {
                    let fieldObject = {
                        key: field.id,
                        type: field.field_type,
                        templateOptions: {
                            fieldSetId: fieldset.id,
                            autoId: `id-${fieldset.id}-${field.id}`,
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

                    fieldGroup.fieldGroup.push(fieldObject);
                });

                fields.push(
                    fieldGroup
                );
            });

            return fields;

        };

        this.parseFormToModel = function (form) {
            let model = {};

            form.fieldsets.forEach((fieldset) => {
                model[fieldset.id] = {};
            });

            return model;
        };

        this.parseModelToResponse = function (model) {
            let responses = [];

            Object.keys(model).forEach((id) => {
                responses.push({
                    fieldset: parseInt(id),
                    answers: model[id]
                });
            });

            return responses;
        };
    }
]);

export default moduleProperties;
