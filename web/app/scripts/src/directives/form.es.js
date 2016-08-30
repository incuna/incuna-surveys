import { angular } from '../libraries';

import API from '../services/api';
import FieldsetParser from '../services/fieldsets-parser';

export const moduleProperties = {
    moduleName: 'incuna-surveys.form-directive'
};

const module = angular.module(moduleProperties.moduleName, [
    API.moduleName,
    FieldsetParser.moduleName,
    'incuna-surveys-form.templates'
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
            templateUrl: 'templates/incuna-surveys/form/survey-form.html',
            link: function ($scope) {
                $scope.model = {};
                $scope.$watch('formUrl', (url) => {
                    if (url) {
                        API.getForm(url).then(function (structure) {
                            $scope.fields = FieldsetParser.parseFields(structure);
                            // Only set the empty model if the model has not
                            // been set.
                            if (Object.keys($scope.model).length === 0) {
                                $scope.model = FieldsetParser.parseFormToModel(structure);
                            }
                        });
                    }
                });

                $scope.$watch('responseUrl', (url) => {
                    if (url) {
                        API.get(url).then(function (data) {
                            $scope.model = data;
                        });
                    }
                });

                $scope.submit = function () {
                    if ($scope.responseUrl) {
                        // TODO: Handle errors.
                        const responses = FieldsetParser.parseModelToResponse($scope.model);
                        API.post($scope.responseUrl, responses);
                    }
                }
            }
        };
    }
]);

export default moduleProperties;
