const ProjectConfig = function () {
    let settings = {
        apiRoot: 'localhost:8000'
    };

    return {
        $get: function () {
            return {
                getApiRoot: () => settings.apiRoot
            }
        },
        setApiRoot: (value) => {
            settings.apiRoot = value;
        }
    };
}

export const provider = [
    ProjectConfig
];

export default provider;
