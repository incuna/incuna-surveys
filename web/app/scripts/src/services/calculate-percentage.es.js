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

        var isAnswerComplete = function (answer) {
            if (answer === 0) {
                // Zero is valid
                return true;
            }
            if (!answer) {
                // Any non zero negative value such as null, "", NaN, etc.
                return false;
            }
            if (answer instanceof Array) {
                // Any value must be valid
                return answer.some(isAnswerComplete);
            }
            if (answer instanceof Object) {
                // Is the object values valid
                return isAnswerComplete(Object.values(answer));
            }

            return true;
        };

        this.getImportantQuestionKeys = function (form) {
            let qKeys = [];
            angular.forEach(form, function (question) {
                angular.forEach(question.fieldGroup, function (field) {
                    if (field.templateOptions.fieldOptions.important === true) {
                        qKeys.push(field.key)
                    }
                });
            });

            return qKeys;
        };

        // answers is an object containing objects
        // object {
        //     1 : {
        //         2 : 0
        //         3 : "Test".
        //         4: {
        //             5: null,
        //             6: 10,
        //             7: 90
        //         }
        //     }
        // }
        // answered is a number of type number
        this.countNumberOfAnsweredQuestions = function (answers, qKeys) {
            let answered = 0;

            if (qKeys.length === 0) {
                return answered;
            }

            for (const groupKey in answers) {
                const answerGroup = answers[groupKey];
                for (const answerKey in answerGroup) {
                    const answer = answerGroup[answerKey];
                    if (qKeys.indexOf(parseInt(answerKey, 10)) !== -1) {
                        if (isAnswerComplete(answer)) {
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
