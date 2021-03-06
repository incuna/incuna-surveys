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
                let importantQuestionKeys = null;
                scope.$watch('questionSet', (questions) => {
                    importantQuestionKeys = CalculateCompletion.getImportantQuestionKeys(questions)
                    totalQuestionCount = importantQuestionKeys.length;
                });

                // Using true to compare the sub-elements.
                scope.$watch('model', (answers) => {
                    if (totalQuestionCount === 0) {
                        return;
                    }
                    const numberOfCompletedQuestions = CalculateCompletion.countNumberOfAnsweredQuestions(answers, importantQuestionKeys);
                    scope.percentageComplete = CalculateCompletion.calculatePercentageComplete(numberOfCompletedQuestions, totalQuestionCount);
                }, true);

            }
        };
    }
]);

export default moduleProperties;
