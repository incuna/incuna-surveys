import { angular } from '../libraries';

export const moduleProperties = {
    moduleName: 'incuna-surveys.formly-config',
    componentName: 'FieldsConfig'
};

const module = angular.module('incuna-surveys.formly-config', [
    'formly'
]);

module.service('FieldsConfig', [
    function () {
        return {
            templatesBase: 'templates/incuna-surveys/fields'
        };
    }
]);

module.run([
    'formlyConfig',
    moduleProperties.componentName,
    function (formlyConfig, FieldsConfig) {
        const templatesBase = FieldsConfig.templatesBase;

        formlyConfig.setType({
            name: 'free_text',
            templateUrl: `${templatesBase}/free-text.html`
        });

        formlyConfig.setType({
            name: 'number',
            templateUrl: `${templatesBase}/number.html`
        });

        formlyConfig.setType({
            name: 'percentage',
            templateUrl: `${templatesBase}/percentage.html`
        });

        formlyConfig.setType({
            name: 'checkbox',
            templateUrl: `${templatesBase}/checkbox.html`
        });

        formlyConfig.setType({
            name: 'radio',
            templateUrl: `${templatesBase}/radio.html`
        });
    }
]);

export default moduleProperties;
