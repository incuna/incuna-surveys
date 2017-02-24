import { angular } from '../libraries';

import ProportionField from '../services/proportion-field';
import IntegerFielddDirective from 'integer-field';

const moduleProperties = {
    moduleName: 'incuna-surveys.proportion-field-directive'
};

const module = angular.module(moduleProperties.moduleName, [
    ProportionField.moduleName,
    IntegerFielddDirective.moduleName
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
                scope.amountLeft = 100;
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
                    console.log(values);
                    if (!values) {
                        scope.model = {};
                    }
                    scope.amountLeft = 100 - Object.values(scope.model).reduce((sum, item) => sum += (item || 0), 0)
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
