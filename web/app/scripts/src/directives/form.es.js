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
                formUrl: '=',
                responseUrl: '='
            },
            templateUrl: 'templates/incuna-surveys/survey-form.html',
            link: function ($scope) {
                $scope.$watch('formUrl', (url) => {
                    if (url) {
                        API.getForm(url).then(function (structure) {
                            $scope.fields = FieldsetParser.parseFields(structure);
                            // Only set the empty model if the model has not
                            // been set.
                            if (Object.keys($scope.model).length === 0) {
                                $scope.model = FieldsetParser.parseModel(structure);
                            }
                        });
                    }
                });

                $scope.$watch('responseUrl', (url) => {
                    if (url) {
                        API.get(url).then(function (data) {
                            $scope.model = FieldsetParser.parseData(data);
                        });
                    }
                });

                $scope.submit = () => {
                    if ($scope.responseUrl) {
                        // TODO: Handle errors.
                        API.post($scope.responseUrl, $scope.model);
                    }
                }

                $scope.submit();
            }
        };
    }
]);

export default moduleProperties;
