'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _libraries = require('./../libraries.js');

var _proportionField = require('./../services/proportion-field.js');

var _proportionField2 = _interopRequireDefault(_proportionField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moduleProperties = {
    moduleName: 'incuna-surveys.proportion-field-directive'
};

var _module = _libraries.angular.module(moduleProperties.moduleName, [_proportionField2.default.moduleName]);

_module.directive('ensureInteger', [function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function link(scope, element, attr, ctrl) {
            ctrl.$parsers.push(function (val) {
                if (val) {
                    var value = parseInt(val, 10);
                    if (Number.isNaN(value)) {
                        return undefined;
                    }
                    return value;
                }
                return null;
            });
        }
    };
}]);

_module.directive('integerField', [function () {
    return {
        templateUrl: 'templates/incuna-surveys/form/integer-field.html',
        scope: {
            form: '=',
            model: '=',
            id: '='
        }
    };
}]);

_module.directive('proportionField', [_proportionField2.default.componentName, function (ProportionField) {
    return {
        restrict: 'A',
        scope: {
            form: '=',
            model: '=',
            options: '=proportionField'
        },
        templateUrl: 'templates/incuna-surveys/form/proportion-field.html',
        link: function link(scope) {
            scope.fields = [];
            var deregisterOptionsWatcher = scope.$watch('options', function (options) {
                if (!options) {
                    return;
                }
                if (options.fieldOptions) {
                    scope.title = options.fieldOptions.label;
                }
                if (options.choices) {
                    scope.fields = ProportionField.buildFields(options.choices, options.fieldOptions, options.autoId);
                }
                deregisterOptionsWatcher();
            });

            scope.$watch('options.fieldOptions.errors', function (errors) {
                ProportionField.addErrors(scope.fields, errors || {});
            });

            scope.$watch('model', function (values) {
                if (values === null) {
                    scope.model = {};
                }
                scope.total = ProportionField.calculateTotal(values);
                if (values) {
                    ProportionField.addPercentages(scope.fields, values, scope.total);
                }
            }, true);
        }
    };
}]);

exports.default = moduleProperties;
