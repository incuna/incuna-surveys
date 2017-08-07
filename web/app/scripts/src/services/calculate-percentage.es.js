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
        let qKeys = [];

        this.countQuestionsTotal = function (form) {
            let totalQuestionCount = 0;
            angular.forEach(form, function (question) {
                angular.forEach(question.fieldGroup, function (field) {
                    if (field.templateOptions.fieldOptions.important === true) {
                        totalQuestionCount = totalQuestionCount + 1;
                        qKeys.push(field.key)
                    }
                });
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

            if (qKeys.length === 0) {
                return answered;
            }

            for (const groupKey in answers) {
                const answerGroup = answers[groupKey];
                for (const answerKey in answerGroup) {
                    const answer = answerGroup[answerKey];
                    if (qKeys.indexOf(parseInt(answerKey)) !== -1) {
                        if (answer && answer !== null || answer === 0) {
                            answered++;
                        }
                    }
                }
            }

            return answered;
        };

        this.calculatePercentageComplete = function (completedQuestions, totalQuestionCount) {
            const zero = 0 + '%';

            if (totalQuestionCount === 0) {
                return zero;
            }

            const result = ((completedQuestions / totalQuestionCount) * 100)
            if (result >= 0) {
                return Math.round(result) + '%';
            }

            return zero;
        };

    }
]);

export default moduleProperties;
