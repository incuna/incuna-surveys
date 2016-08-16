import { angular } from '../libraries';

const ProjectConfig = function () {
    let settings = {
        apiRoot: 'localhost:8000'
    };

    return {
        $get: function () {
            return {
                getSettings: () => settings
            }
        },
        setApiRoot: (value) => {
            settings.apiRoot = value;
        }
    };
};

export const module = {
    moduleName: 'incuna.surveys-config',
    componentName: 'ProjectConfig'
};

angular.module(module.moduleName, [])
    .provider(module.componentName, [ProjectConfig]);

export default module;
