import { angular } from '../libraries';

import API from '../services/api';
import FieldsetParser from '../services/fieldsets-parser';

export const moduleProperties = {
    moduleName: 'incuna-surveys.form-directive'
};

const module = angular.module(moduleProperties.moduleName, [
    API.moduleName,
    FieldsetParser.moduleName
]);

module.directive('surveysForm', [
    API.componentName,
    FieldsetParser.componentName,
    function (
        API,
        FieldsetParser
    ) {
        return {
            restrict: 'A',
            scope: {
                getUrl: '=',
                postUrl: '='
            },
            templateUrl: 'templates/incuna-surveys/survey-form.html',
            link: function ($scope) {
                $scope.form = {}
                $scope.$watch('getUrl', (url) => {
                    if (url) {
                        API.getForm(url).then(function (structure) {
                            $scope.fields = FieldsetParser.parseFields(structure);
                            $scope.model = FieldsetParser.parseModel(structure);
                        });
                    }
                });

                $scope.submit = () => {
                    if ($scope.postUrl) {
                        // TODO: Handle errors.
                        API.post($scope.postUrl, $scope.model);
                    }
                }

                $scope.submit();
            }
        };
    }
]);

export default moduleProperties;
