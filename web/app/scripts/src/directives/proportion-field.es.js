import { angular } from '../libraries';

import ProportionField from '../services/proportion-field';

const moduleProperties = {
    moduleName: 'incuna-surveys.proportion-field-directive'
};

const module = angular.module(moduleProperties.moduleName, [
    ProportionField.moduleName
]);

module.directive('proportionField', [
    ProportionField.componentName,
    function (ProportionField) {
        return {
            restrict: 'A',
            scope: {
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
