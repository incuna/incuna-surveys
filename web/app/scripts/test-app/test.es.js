(function (angular) {
    
    const module = angular.module('test-app', ['incuna-surveys']);

    module.controller('FormCtrl', [
        'formlyConfig',
        'FieldsParser',
        '$http',
        function (
            formlyConfig,
            FieldsetParserService,
            $http
        ) {

            $http({
                method: 'GET',
                url: '/scripts/src/get.json'
            }).then((res) => {
                const form = res.data.OK.response_data;

                this.fields = FieldsetParserService.parseFields(form);
                this.model = FieldsetParserService.parseModel(form);

                this.structure = res.data.OK.response_data;
            });

        }
    ]);

}(window.angular));
