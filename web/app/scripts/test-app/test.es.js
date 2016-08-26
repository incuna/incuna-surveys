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
                this.model = FieldsetParserService.parseFormToModel(form);

                // Used by the `survey-form` directive to get the form and post
                // the data.
                this.formUrl = 'http://127.0.0.1:8000/forms/1'
                this.responseUrl = 'http://127.0.0.1:8000/forms/1/respond/test-user'
            });

        }
    ]);

}(window.angular));
