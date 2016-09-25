/*
 *
 * This module calculates the survey completion percentage/
 *
 */

import { angular } from '../libraries';

export const moduleProperties = {
    moduleName: 'incuna-surveys.proportion-field',
    componentName: 'proportionField'
};

const module = angular.module(moduleProperties.moduleName, []);

module.service(moduleProperties.componentName, [
    function () {

        this.buildFields = function (choices, defaults, autoId) {
            return choices.map((choice, index) => {
                return Object.assign(
                    {},
                    defaults,
                    {
                        label: choice,
                        id: `${autoId}-${index}`
                    }
                );
            });
        };

        this.calculateTotal = function (values) {
            return Object.keys(values).reduce((value, key) => {
                    let current = 0;
                    if (angular.isNumber(values[key])) {
                       current = parseInt(values[key], 10)
                    }
                    return value + current
                },
                0
            );
        };

        this.addPercentages = function (fields, values, total) {
            fields.forEach((options, key) => {
                const value = parseInt(values[key], 10) || 0;
                options.percentage = value ? value / total * 100 : 0;
            })
        };

        this.addErrors = function (fields, errors) {
            fields.forEach((options, index) => {
                options.errors = errors[index];
            });
        };

    }
]);

export default moduleProperties;

