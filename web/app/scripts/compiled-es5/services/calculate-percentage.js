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
        var questions = form;
        var totalQuestionCount = 0;

        _libraries.angular.forEach(questions, function (question) {
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
        var answered = 0;

        for (var groupKey in answers) {
            var answerGroup = answers[groupKey];
            for (var answerKey in answerGroup) {
                var answer = answerGroup[answerKey];
                if (_libraries.angular.isDefined(answer) && answer !== null) {
                    answered++;
                }
            }
        }

        return answered;
    };

    this.calculatePercentageComplete = function (completedQuestions, totalQuestionCount) {
        var result = completedQuestions / totalQuestionCount * 100;
        if (result >= 0) {
            return Math.round(result) + '%';
        }

        return 0 + '%';
    };
}]);

exports.default = moduleProperties;
