/*
 *
 * This module parses a form API into an angular-formly array
 *
 */

import { angular } from '../libraries';

export const moduleProperties = {
    moduleName: 'incuna-surveys.field-parser',
    componentName: 'FieldsParser'
};

const module = angular.module(moduleProperties.moduleName, []);

module.service(moduleProperties.componentName, [
    function () {
        this.parseFields = function (form) {
            return form.fieldsets.map((fieldset) => {
                return {
                    wrapper: 'panel',
                    templateOptions: fieldset,
                    fieldGroup: fieldset.fields.map((field) => {
                        return {
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
                    })
                };
            });
        };

        this.parseFormToModel = function (form) {
            let model = {};

            form.fieldsets.forEach((fieldset) => {
                model[fieldset.id] = {};
            });

            return model;
        };
    }
]);

export default moduleProperties;
