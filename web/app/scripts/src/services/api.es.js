import { angular } from '../libraries';

import ProjectConfig from '../providers/project-config';

export const API = function ($http, ProjectConfig) {
    return {
        getBaseUrl: function () {
            const endpoint = 'forms';
            const apiRoot = ProjectConfig.getSettings().apiRoot;
            return `${apiRoot}/${endpoint}`;
        },
        getList: function () {
            const url = this.getBaseUrl();

            return $http.get(url)
                .then((response) => response.data);
        },
        getForm: function (url) {
            return $http.get(url)
                .then((response) => response.data);
        }
    }
};

export const module = {
    moduleName: 'incuna.surveys-api',
    componentName: 'API'
};

angular.module(module.moduleName, [ProjectConfig.moduleName])
    .service([
        '$http',
        ProjectConfig.componentName,
        API
    ]);

export default module;
