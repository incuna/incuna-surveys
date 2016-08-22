import { angular } from '../libraries';

import FieldsetParser from '../services/fieldsets-parser';

export const moduleProperties = {
    moduleName: 'incuna-surveys.form-directive'
};

const module = angular.module(moduleProperties.moduleName, [
    FieldsetParser.moduleName
]);

module.directive('surveysForm', [
    FieldsetParser.componentName,
    function (FieldsetParserService) {
        return {
            restrict: 'A',
            scope: {
                formStructure: '='
            },
            template: '<formly-form model="model" fields="fields"></formly-form>',
            link: function ($scope, $element, $attrs) {
                $scope.$watch('formStructure', (form) => {
                    if (form) {
                        $scope.fields = FieldsetParserService.parseFields(form);
                        $scope.model = FieldsetParserService.parseModel(form);
                    }
                });
            }
        };
    }
]);

export default moduleProperties;
