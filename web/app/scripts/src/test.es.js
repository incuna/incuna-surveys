// TODO: remove this file, it is only proof of concept

export const module = function () {
    angular.module('test-app', ['formly'])
        .controller('FormCtrl', ['formlyConfig', function (formlyConfig) {
            formlyConfig.setType({
                name: 'input',
                template: '<label>{{ to.label }}</label><input type="text" ng-model="model[options.key]">'
            });

            this.model = {};

            this.fields = [
                {
                    fieldGroup: [
                        {
                            key: 'one',
                            type: 'input',
                            templateOptions: {
                                label: 'Blabla'
                            },
                        }
                    ]
                },
                {
                    template: '<hr>{{ to.test }}<hr>',
                    templateOptions: {
                        test: 'X'
                    }
                },

                {
                    fieldGroup: [
                        { 
                            key: 'two',
                            type: 'input',
                            templateOptions: {
                                label: 'Ugabuga'
                            }
                        }
                    ]
                }

            ];
        }]);
        
};

export default module;
