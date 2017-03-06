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
            if (!values) {
                return 0;
            }
            return Object.keys(values).reduce((total, key) => {
                const value = parseInt(values[key], 10) || 0;
                return total + value;
            }, 0);
        };

        this.addPercentages = function (fields, values, total) {
            fields.forEach((options, key) => {
                const value = parseInt(values[key], 10) || 0;
                options.percentage = value ? value / total * 100 : 0;
            });
        };

        this.addErrors = function (fields, errors) {
            fields.forEach((options, index) => {
                options.errors = errors[index];
            });
        };

        this.getChangedFieldIndex = function (newModel, oldModel) {
            const newValues = Object.values(newModel);
            const oldValues = Object.values(oldModel);

            return newValues.reduce((sum, element, index) => {
                return sum + (element !== oldValues[index] ? index : 0);
            }, 0);

        }

    }
]);

export default moduleProperties;

