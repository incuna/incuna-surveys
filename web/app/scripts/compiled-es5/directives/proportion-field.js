'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _libraries = require('./../libraries.js');

var moduleProperties = {
    moduleName: 'incuna-surveys.proportion-field-directive'
};

var _module = _libraries.angular.module(moduleProperties.moduleName, []);

_module.directive('proportionField', [function () {
    return {
        restrict: 'A',
        scope: {
            model: '=',
            options: '=proportionField'
        },
        templateUrl: 'templates/incuna-surveys/form/proportion-field.html',
        link: function link(scope) {
            scope.fields = [];
            scope.$watch('options', function (options) {
                if (options.fieldOptions) {
                    scope.title = options.fieldOptions.label;
                }
                if (options.choices) {
                    options.choices.forEach(function (choice, index) {
                        scope.fields[index] = Object.assign({}, options.fieldOptions, {
                            label: choice,
                            id: options.autoId + '-' + index
                        });
                    });
                }
            });

            scope.$watch('options.fieldOptions.errors', function (errors) {
                if (errors) {
                    scope.fields.forEach(function (options, index) {
                        options.errors = errors[index];
                    });
                }
            });

            scope.$watch('model', function (values) {
                scope.total = Object.keys(values).reduce(function (value, key) {
                    return value + (values[key] ? parseInt(values[key], 10) : 0);
                }, 0);
                if (values) {
                    scope.fields.forEach(function (options, key) {
                        var value = parseInt(values[key], 10) || 0;
                        options.percentage = value ? value / scope.total * 100 : 0;
                    });
                }
            }, true);
        }
    };
}]);

exports.default = moduleProperties;
