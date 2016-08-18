import { angular } from '../libraries';

export const moduleProperties = {
    moduleName: 'incuna-surveys.formly-config',
    componentName: 'FieldsConfig'
};

const module = angular.module(moduleProperties.moduleName, [
    'formly'
]);

module.service('FieldsConfig', [
    function () {
        const templatesBase = 'templates/incuna-surveys/fields';

        return {
            templatesBase,
            headerTemplateUrl: `${templatesBase}/header.html`,
            fieldsetHeaderTemplateUrl: `${templatesBase}/fieldset-header.html`
        };
    }
]);

module.run([
    'formlyConfig',
    'FieldsConfig',
    function (
        formlyConfig,
        FieldsConfig
    ) {
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
