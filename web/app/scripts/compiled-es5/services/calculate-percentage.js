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
    this.countQuestionsTotal = function (form) {
        var totalQuestionCount = 0;
        _libraries.angular.forEach(form, function (question) {
            _libraries.angular.forEach(question.fieldGroup, function (field) {
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
        var answered = 0;
        var qKeys = [];

        _libraries.angular.forEach(questions, function (question) {
            for (var i = 0; i < question.fieldGroup.length; i++) {
                if (question.fieldGroup[i].templateOptions.fieldOptions.important === true) {
                    qKeys.push(question.fieldGroup[i].key);
                }
            }
        });
        for (var groupKey in answers) {
            var answerGroup = answers[groupKey];
            for (var answerKey in answerGroup) {
                var answer = answerGroup[answerKey];
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
