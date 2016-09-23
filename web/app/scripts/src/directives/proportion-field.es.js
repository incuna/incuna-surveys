import { angular } from '../libraries';

const moduleProperties = {
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
                scope.fields = [];
                scope.$watch('options', (options) => {
                    if (options.fieldOptions) {
                        scope.title = options.fieldOptions.label;
                    }
                    if (options.choices) {
                        options.choices.forEach((choice, index) => {
                            scope.fields[index] = Object.assign(
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

                scope.$watch('options.fieldOptions.errors', (errors) => {
                    if (errors) {
                        scope.fields.forEach((options, index) => {
                            options.errors = errors[index];
                        });
                    }
                });

                scope.$watch('model', (values) => {
                    scope.total = Object.keys(values).reduce(
                        ( value, key ) => value + (values[key] ? parseInt(values[key], 10) : 0),
                        0
                    );
                    if (values) {
                        scope.fields.forEach((options, key) => {
                            const value = parseInt(values[key], 10) || 0;
                            options.percentage = value ? value / scope.total * 100 : 0;
                        })
                    }
                }, true);
            }
        };
    }
]);

export default moduleProperties;
