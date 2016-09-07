'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moduleProperties = undefined;

var _libraries = require('./../libraries.js');

var _fieldsConfig = require('./fields-config.js');

var _fieldsConfig2 = _interopRequireDefault(_fieldsConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 *
 * This module parses a form API into an angular-formly array
 *
 */

var moduleProperties = exports.moduleProperties = {
    moduleName: 'incuna-surveys.field-parser',
    componentName: 'FieldsParser'
};

var _module = _libraries.angular.module(moduleProperties.moduleName, [_fieldsConfig2.default.moduleName]);

_module.service(moduleProperties.componentName, [_fieldsConfig2.default.componentName, function () {
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

    this.parseModelToResponse = function (model) {
        var responses = [];

        Object.keys(model).forEach(function (id) {
            responses.push({
                fieldset: parseInt(id),
                answers: model[id]
            });
        });

        return responses;
    };
}]);

exports.default = moduleProperties;
