'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moduleProperties = undefined;

var _libraries = require('./../libraries.js');

var moduleProperties = exports.moduleProperties = {
    moduleName: 'incuna-surveys.calculate-completion-percent',
    componentName: 'calculateCompletionPercent'
}; /*
    *
    * This module calculates the survey completion percentage/
    *
    */

var _module = _libraries.angular.module(moduleProperties.moduleName, []);

_module.service(moduleProperties.componentName, [function () {

    var isAnswerComplete = function isAnswerComplete(answer) {
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
        var qKeys = [];
        _libraries.angular.forEach(form, function (question) {
            _libraries.angular.forEach(question.fieldGroup, function (field) {
                if (field.templateOptions.fieldOptions.important === true) {
                    qKeys.push(field.key);
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
        var answered = 0;

        if (qKeys.length === 0) {
            return answered;
        }

        for (var groupKey in answers) {
            var answerGroup = answers[groupKey];
            for (var answerKey in answerGroup) {
                var answer = answerGroup[answerKey];
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
        var zero = 0 + '%';

        if (totalQuestionCount === 0) {
            return zero;
        }

        var result = completedQuestions / totalQuestionCount * 100;
        if (result >= 0) {
            return Math.round(result) + '%';
        }

        return zero;
    };
}]);

exports.default = moduleProperties;
