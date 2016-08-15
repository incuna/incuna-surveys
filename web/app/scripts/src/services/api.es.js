export const api = function ($http, ProjectConfig) {
    return {
        getBaseUrl: function () {
            const endpoint = 'forms';
            const apiRoot = ProjectConfig.getApiRoot();
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

export const service = [
    '$http',
    'ProjectConfig',
    api
];

export default service;
