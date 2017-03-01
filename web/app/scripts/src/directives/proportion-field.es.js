import { angular, _ } from '../libraries';

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

                scope.$watch('model', (newModel, oldModel) => {
                    if (!newModel || !oldModel) {
                        scope.model = {};
                        return
                    }

                    const newValues = Object.values(newModel)
                    const oldValues = Object.values(oldModel)

                    const changedIndex = newValues.reduce((sum, element, index) => {
                        return sum + (element !== oldValues[index] ? index : 0)
                    }, 0)

                    const newSum = Object.values(newModel).reduce((sum, item) => sum += (item || 0), 0)
                    const oldSUm = Object.values(oldModel).reduce((sum, item) => sum += (item || 0), 0)

                    if (newSum > 100) {
                        scope.model[changedIndex] -= newSum - 100;
                    }
                    scope.total = ProportionField.calculateTotal(newModel);
                    if (newModel) {
                        ProportionField.addPercentages(scope.fields, newModel, scope.total);
                    }
                }, true);
            }
        };
    }
]);

export default moduleProperties;
