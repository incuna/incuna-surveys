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
                        return;
                    }

                    const newSum = ProportionField.calculateTotal(newModel)
                    const changedIndex = ProportionField.getChangedFieldIndex(newModel, oldModel);

                    if (newSum > 100) {
                        scope.model[changedIndex] -= newSum - 100;
                    }
                }, true);
            }
        };
    }
]);

export default moduleProperties;
