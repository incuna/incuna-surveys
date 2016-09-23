'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moduleProperties = undefined;

var _libraries = require('./../libraries.js');

var moduleProperties = exports.moduleProperties = {
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
            scope.choiceOptions = [];
            scope.$watch('options', function (options, oldValue) {
                if (options.fieldOptions) {
                    scope.title = options.fieldOptions.label;
                }
                if (options.choices) {
                    options.choices.forEach(function (choice, index) {
                        scope.choiceOptions[index] = Object.assign({}, options.fieldOptions, {
                            label: choice,
                            id: options.autoId + '-' + index
                        });
                    });
                }
            });

            scope.$watch('options.fieldOptions.errors', function (errors, oldValue) {
                console.log(errors, oldValue);
                if (errors) {
                    scope.choiceOptions.forEach(function (options, index) {
                        options.errors = errors[index];
                    });
                }
            });
        }
    };
}]);

exports.default = moduleProperties;
