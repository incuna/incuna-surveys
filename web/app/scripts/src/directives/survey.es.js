import { angular } from '../libraries';

import API from '../services/api';
import FieldsetParser from '../services/fieldsets-parser';

export const moduleProperties = {
    moduleName: 'incuna-surveys.survey-directive'
};

const module = angular.module(moduleProperties.moduleName, [
    API.moduleName,
    FieldsetParser.moduleName    
]);

module.directive('surveysSurvey', [
    API.componentName,
    FieldsetParser.componentName,
    function (API, FieldsetParser) {
        return {
            restrict: 'A',
            scope: {
                url: '=',
            },
            template: '<from ng-submit="submit()"><formly-form model="model" fields="fields"></formly-form><input type="submit" id="submit" value="Submit" /></form>',
            link: function ($scope, $element, $attrs) {
                let url = null;
                $scope.form = {}
                $scope.$watch('getUrl', (value) => {
                    if (value) {
                        url = value; 
                        const structure = API.getForm(url);
                        $scope.fields = FieldsetParserService.parseFields(structure);
                        $scope.model = FieldsetParserService.parseModel(structure);
                    }
                });

                $scope.submit = () => {
                    if (postUrl) {
                        API.post(url, form.$scope.model);
                    }
                } 
            }
        };
    }
]);

export default moduleProperties;

