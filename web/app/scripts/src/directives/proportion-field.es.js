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
                const baseSliderOptions = {
                    maxLimit: 100,
                    floor: 0,
                    ceil: 100,
                    showSelectionBar: true,
                    hideLimitLabels: true
                };
                scope.optionsPerSlider = [];
                scope.fields = [];
                scope.total = 0;
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

                    scope.fields.forEach(() => {
                        scope.optionsPerSlider.push(Object.assign({}, baseSliderOptions));
                    });

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

                    if ( Object.values(oldModel).every( (x) => { return x === null; } ){
                        return;
                    }

                    const newSum = ProportionField.calculateTotal(newModel);
                    scope.total = newSum;

                    if (newSum > 100) {
                        scope.total = 100
                        const changedIndex = ProportionField.getChangedFieldIndex(newModel, oldModel);
                        scope.model[changedIndex] -= newSum - 100;
                    }

                    scope.fields.forEach((val, i) => {
                        scope.optionsPerSlider[i].maxLimit = 100 - newSum + scope.model[i];
                    });

                }, true);
            }
        };
    }
]);

export default moduleProperties;
