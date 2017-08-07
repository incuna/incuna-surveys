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
        this.countQuestionsTotal = function (form) {
            let totalQuestionCount = 0;
            angular.forEach(form, function (question) {
                angular.forEach(question.fieldGroup, function (field) {
                    if (field.templateOptions.fieldOptions.important === true) {
                        totalQuestionCount = totalQuestionCount + 1;
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
        this.countNumberOfAnsweredQuestions = function (answers, questions) {
            let answered = 0;
            let qKeys = [];

            angular.forEach(questions, function (question) {
                for (var i = 0; i < question.fieldGroup.length; i++) {
                    if (question.fieldGroup[i].templateOptions.fieldOptions.important === true) {
                        qKeys.push(question.fieldGroup[i].key)
                    }
                }
            });
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
