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
                responseUrl: '=',
                onSuccess: '&',
                onFailure: '&'
            },
            templateUrl: 'templates/incuna-surveys/form/survey-form.html',
            link: function (scope) {
                scope.model = {};
                scope.percentageComplete = 0 + '%';

                const countQuestions = function () {
                    const questions = scope.form.fieldsets;
                    scope.totalQuestionCount = 0;

                    angular.forEach(questions, function(question) {
                        scope.totalQuestionCount = scope.totalQuestionCount + question.fields.length;
                    });
                };

                scope.$watch('formUrl', (url) => {
                    if (url) {
                        API.getForm(url).then(function (structure) {
                            scope.form = structure;
                            scope.fields = FieldsetParser.parseFields(structure);
                            // Only set the empty model if the model has not
                            // been set.
                            if (Object.keys(scope.model).length === 0) {
                                scope.model = FieldsetParser.parseFormToModel(structure);
                                countQuestions();
                            }
                        });
                    }
                });

                const checkAnswered = function (answers) {
                    let answered = 0;
                    angular.forEach(answers, function(answerGroup) {
                        angular.forEach(answerGroup, function(item) {
                            if (item > 0 || item.length > 0) {
                                answered = answered + 1;
                            }
                        });
                    });

                    return answered;
                }

                const calculatePercentageComplete = function (completedQuestions) {
                    let result = ((completedQuestions/scope.totalQuestionCount)*100)
                    if (!isNaN(result)) {
                        scope.percentageComplete = Math.round(result) + '%';
                    }
                }

                scope.$watch('model', (answers) => {
                    let completedQuestions = checkAnswered(answers);
                    calculatePercentageComplete(completedQuestions)
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
                        const responses = FieldsetParser.parseModelToResponse(scope.model);
                        API.post(scope.responseUrl, responses)
                            .then(scope.onSuccess)
                            .catch(scope.onFailure);
                    }
                }
            }
        };
    }
]);

export default moduleProperties;
