import { angular } from '../libraries';

export const moduleProperties = {
    moduleName: 'incuna.surveys.config',
    componentName: 'ProjectConfig'
};

const module = angular.module(moduleProperties.moduleName, []);

module.provider(moduleProperties.componentName, [
    function () {
        let settings = {
            apiRoot: 'localhost:8000'
        };

        return {
            $get: () => settings,
            setApiRoot: (value) => {
                settings.apiRoot = value;
            }
        };
    }
]);

export default moduleProperties;
