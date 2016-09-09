/*
 *
 * This module calculates the survey completion percentage/
 *
 */

import { angular } from '../libraries';

export const moduleProperties = {
    moduleName: 'incuna-surveys.calculate-completion-percent',
    componentName: 'calculateCompletionPercent'
};

const module = angular.module(moduleProperties.moduleName, []);

module.service(moduleProperties.componentName, [
    function () {
        this.countQuestionsTotal = function(form) {
            const questions = form;
            let totalQuestionCount = 0;

            angular.forEach(questions, function(question) {
                totalQuestionCount = totalQuestionCount + question.fieldGroup.length;
            });

            return totalQuestionCount;
        };

        // answers is an object containing objects
        // object {
        //     1 : {
        //         2 : 0
        //         3 : 0
        //     }
        // }
        // answered is a number of type number
        this.countNumberOfAnsweredQuestions = function (answers) {
            let answered = 0;

            for (const groupKey in answers) {
                const answerGroup = answers[groupKey];
                for (const answerKey in answerGroup) {
                    const answer = answerGroup[answerKey];
                    if (answer > 0 || answer.length > 0) {
                        answered++;
                    }
                }
            }

            return answered;
        };

        this.calculatePercentageComplete = function (completedQuestions, totalQuestionCount) {
            const result = ((completedQuestions / totalQuestionCount) * 100)
            if (result >= 0) {
                return Math.round(result) + '%';
            }

            return  0 + '%';
        };

    }
]);

export default moduleProperties;
