'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moduleProperties = undefined;

var _libraries = require('./../libraries.js');

var moduleProperties = exports.moduleProperties = {
    moduleName: 'incuna-surveys.field-parser',
    componentName: 'FieldsParser'
}; /*
    *
    * This module parses a form API into an angular-formly array
    *
    */

var _module = _libraries.angular.module(moduleProperties.moduleName, []);

_module.service(moduleProperties.componentName, [function () {
    this.parseFields = function (form) {
        return form.fieldsets.map(function (fieldset) {
            return {
                wrapper: 'panel',
                templateOptions: fieldset,
                fieldGroup: fieldset.fields.map(function (field) {
                    return {
                        key: field.id,
                        type: field.field_type,
                        templateOptions: {
                            fieldSetId: fieldset.id,
                            autoId: 'id-' + fieldset.id + '-' + field.id,
                            choices: field.answers,
                            fieldOptions: {
                                // jscs:disable disallowQuotedKeysInObjects
                                'help_text': field.help_text,
                                required: field.required,
                                important: field.important,
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
        var model = {};

        form.fieldsets.forEach(function (fieldset) {
            model[fieldset.id] = {};
        });

        return model;
    };

    this.addFieldErrors = function (fields, errors) {
        if (fields && errors) {
            fields.forEach(function (fieldset) {
                var key = fieldset.templateOptions.id;
                var fieldsetErrors = errors[key];
                fieldset.fieldGroup.forEach(function (field) {
                    var fieldError = fieldsetErrors && fieldsetErrors[field.key];
                    field.templateOptions.fieldOptions.errors = fieldError;
                });
            });
        }
    };
}]);

exports.default = moduleProperties;
