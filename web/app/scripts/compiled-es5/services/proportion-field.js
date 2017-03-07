'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moduleProperties = undefined;

var _libraries = require('./../libraries.js');

var moduleProperties = exports.moduleProperties = {
    moduleName: 'incuna-surveys.proportion-field',
    componentName: 'proportionField'
}; /*
    *
    * This module calculates the survey completion percentage/
    *
    */

var _module = _libraries.angular.module(moduleProperties.moduleName, []);

_module.service(moduleProperties.componentName, [function () {

    this.buildFields = function (choices, defaults, autoId) {
        return choices.map(function (choice, index) {
            return Object.assign({}, defaults, {
                label: choice,
                id: autoId + '-' + index
            });
        });
    };

    this.calculateTotal = function (values) {
        if (!values) {
            return 0;
        }
        return Object.keys(values).reduce(function (total, key) {
            var value = parseInt(values[key], 10) || 0;
            return total + value;
        }, 0);
    };

    this.addPercentages = function (fields, values, total) {
        fields.forEach(function (options, key) {
            var value = parseInt(values[key], 10) || 0;
            options.percentage = value ? value / total * 100 : 0;
        });
    };

    this.addErrors = function (fields, errors) {
        fields.forEach(function (options, index) {
            options.errors = errors[index];
        });
    };

    this.getChangedFieldIndex = function (newModel, oldModel) {
        var newValues = Object.values(newModel);
        var oldValues = Object.values(oldModel);

        return newValues.findIndex(function (el, i) {
            return el !== oldValues[i];
        });
    };
}]);

exports.default = moduleProperties;
