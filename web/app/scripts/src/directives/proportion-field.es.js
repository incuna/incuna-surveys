import { angular } from '../libraries';

import ProportionField from '../services/proportion-field';

const moduleProperties = {
    moduleName: 'incuna-surveys.proportion-field-directive'
};

const module = angular.module(moduleProperties.moduleName, [
    ProportionField.moduleName
]);

module.directive('ensureInteger', [
    function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attr, ctrl) {
                ctrl.$parsers.push((val) => {
                    if (val) {
                        const value = parseInt(val, 10);
                        if (Number.isNaN(value)) {
                            return undefined;
                        }
                        return value;
                    }
                    return null;
                });
            }
        };
    }
]);

module.directive('integerField', [
    function () {
        return {
            templateUrl: 'templates/incuna-surveys/form/integer-field.html',
            scope: {
                form: '=',
                model: '=',
                id: '='
            }
        };
    }

]);

module.directive('proportionField', [
    ProportionField.componentName,
    function (ProportionField) {
        return {
            restrict: 'A',
            scope: {
                form: '=',
                model: '=',
                options: '=proportionField'
            },
            templateUrl: 'templates/incuna-surveys/form/proportion-field.html',
            link: function (scope) {
                scope.fields = [];
                const deregisterOptionsWatcher = scope.$watch('options', (options) => {
                    if (!options) {
                        return;
                    }
                    if (options.fieldOptions) {
                        scope.title = options.fieldOptions.label;
                    }
                    if (options.choices) {
                        scope.fields = ProportionField.buildFields(
                            options.choices,
                            options.fieldOptions,
                            options.autoId
                        );
                    }
                    deregisterOptionsWatcher();
                });

                scope.$watch('options.fieldOptions.errors', (errors) => {
                    ProportionField.addErrors(scope.fields, errors || {});
                });

                scope.$watch('model', (values) => {
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
    }
]);

export default moduleProperties;
