import { angular } from '../libraries';

import API from '../services/api';
import CalculateCompletion from '../services/calculate-percentage';

export const moduleProperties = {
    moduleName: 'incuna-surveys.calculate-percentage-directive'
};

const module = angular.module(moduleProperties.moduleName, [
    API.moduleName,
    CalculateCompletion.moduleName
]);

module.directive('calculatePercentage', [
    API.componentName,
    CalculateCompletion.componentName,
    function (
        API,
        CalculateCompletion
    ) {
        return {
            restrict: 'A',
            scope: {
                questionSet: '=',
                model: '='
            },
            templateUrl: 'templates/incuna-surveys/form/calculate-percentage.html',
            link: function (scope) {
                scope.percentageComplete = 0 + '%';
                let totalQuestionCount = 0;

                scope.$watch('questionSet', (questions) => {
                    totalQuestionCount = CalculateCompletion.countQuestionsTotal(questions);
                });

                // Using true to compare the sub-elements.
                scope.$watch('model', (answers) => {
                    const numberOfCompletedQuestions = CalculateCompletion.countNumberOfAnsweredQuestions(answers);
                    scope.percentageComplete = CalculateCompletion.calculatePercentageComplete(numberOfCompletedQuestions, totalQuestionCount);
                }, true);
            }
        };
    }
]);

export default moduleProperties;
