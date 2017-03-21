import { angular } from '../libraries';

import CalculateCompletion from '../services/calculate-percentage';

export const moduleProperties = {
    moduleName: 'incuna-surveys.calculate-percentage-directive'
};

const module = angular.module(moduleProperties.moduleName, [
    CalculateCompletion.moduleName
]);

module.directive('calculatePercentage', [
    CalculateCompletion.componentName,
    function (CalculateCompletion) {
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
                    if (totalQuestionCount === 0) {
                        return;
                    }
                    const numberOfCompletedQuestions = CalculateCompletion.countNumberOfAnsweredQuestions(answers);
                    scope.percentageComplete = CalculateCompletion.calculatePercentageComplete(numberOfCompletedQuestions, totalQuestionCount);
                }, true);

            }
        };
    }
]);

export default moduleProperties;
