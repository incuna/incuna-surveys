export const api = function ($http, PROJECT_SETTINGS) {
    return {
        getBaseUrl: function () {
            const endpoint = 'forms';
            return `${PROJECT_SETTINGS.API_ROOT}/${endpoint}`;
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
    'PROJECT_SETTINGS',
    api
];

export default module;
