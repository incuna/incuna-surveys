import { angular } from '../libraries';

import API from '../services/api';
import FieldsetParser from '../services/fieldsets-parser';
import CalculateCompletion from '../services/calculate-percentage-complete';

export const moduleProperties = {
    moduleName: 'incuna-surveys.form-directive'
};

const module = angular.module(moduleProperties.moduleName, [
    API.moduleName,
    FieldsetParser.moduleName,
    CalculateCompletion.moduleName
]);

module.directive('surveysForm', [
    API.componentName,
    FieldsetParser.componentName,
    CalculateCompletion.componentName,
    function (
        API,
        FieldsetParser,
        CalculateCompletion
    ) {
        return {
            restrict: 'A',
            scope: {
                formUrl: '=',
                responseUrl: '=',
                onSuccess: '&',
                onFailure: '&'
            },
            templateUrl: 'templates/incuna-surveys/form/survey-form.html',
            link: function (scope) {
                scope.model = {};
                scope.percentageComplete = 0 + '%';
                let totalQuestionCount = 0;

                scope.$watch('formUrl', (url) => {
                    if (url) {
                        API.getForm(url).then(function (structure) {
                            scope.form = structure;
                            scope.fields = FieldsetParser.parseFields(structure);
                            // Only set the empty model if the model has not
                            // been set.
                            if (Object.keys(scope.model).length === 0) {
                                scope.model = FieldsetParser.parseFormToModel(structure);
                                totalQuestionCount = CalculateCompletion.countQuestionsTotal(scope.form.fieldsets);
                                console.log('hi', totalQuestionCount)
                            }
                        });
                    }
                });

                // Using true to compare the sub-elements.
                scope.$watch('model', (answers) => {
                    const numberOfCompletedQuestions = CalculateCompletion.countNumberOfAnsweredQuestions(answers);
                    scope.percentageComplete = CalculateCompletion.calculatePercentageComplete(numberOfCompletedQuestions, totalQuestionCount);
                }, true);

                scope.$watch('responseUrl', (url) => {
                    if (url) {
                        API.get(url).then(function (data) {
                            scope.model = data;
                        });
                    }
                });

                scope.submit = function () {
                    if (scope.responseUrl) {
                        // TODO: Handle errors.
                        API.post(scope.responseUrl, scope.model)
                            .then(scope.onSuccess)
                            .catch(scope.onFailure);
                    }
                }
            }
        };
    }
]);

export default moduleProperties;
