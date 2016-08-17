import { angular } from '../libraries';

import ProjectConfigModule from '../providers/project-config';

export const moduleProperties = {
    moduleName: 'incuna.surveys-api',
    componentName: 'API'
};

const module = angular.module(moduleProperties.moduleName, [
    ProjectConfigModule.moduleName
]);

module.service(moduleProperties.componentName, [
    '$http',
    ProjectConfigModule.componentName,
    function (
        $http,
        ProjectConfig
    ) {
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
    }
]);

export default moduleProperties;
