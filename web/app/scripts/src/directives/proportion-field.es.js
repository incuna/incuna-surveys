import { angular } from '../libraries';

export const moduleProperties = {
    moduleName: 'incuna-surveys.proportion-field-directive'
};

const module = angular.module(moduleProperties.moduleName, []);

module.directive('proportionField', [
    function () {
        return {
            restrict: 'A',
            scope: {
                model: '=',
                options: '=proportionField'
            },
            templateUrl: 'templates/incuna-surveys/form/proportion-field.html',
            link: function (scope) {
                scope.choiceOptions = [];
                scope.$watch('options', (options, oldValue) => {
                    if (options.fieldOptions) {
                        scope.title = options.fieldOptions.label;
                    }
                    if (options.choices) { 
                        options.choices.forEach((choice, index) => {
                            scope.choiceOptions[index] = Object.assign(
                                {},
                                options.fieldOptions,
                                {
                                    label: choice,
                                    id: `${options.autoId}-${index}`
                                }
                            );
                        });
                    }
                });

                scope.$watch('options.fieldOptions.errors', (errors, oldValue) => {
                    console.log(errors, oldValue);
                    if (errors) {
                        scope.choiceOptions.forEach((options, index) => {
                            options.errors = errors[index];
                        });
                    }
                });
                
            }
        };
    }
]);

export default moduleProperties;
