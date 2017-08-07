'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moduleProperties = undefined;

var _libraries = require('./../libraries.js');

var _calculatePercentage = require('./../services/calculate-percentage.js');

var _calculatePercentage2 = _interopRequireDefault(_calculatePercentage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moduleProperties = exports.moduleProperties = {
    moduleName: 'incuna-surveys.calculate-percentage-directive'
};

var _module = _libraries.angular.module(moduleProperties.moduleName, [_calculatePercentage2.default.moduleName]);

_module.directive('calculatePercentage', [_calculatePercentage2.default.componentName, function (CalculateCompletion) {
    return {
        restrict: 'A',
        scope: {
            questionSet: '=',
            model: '='
        },
        templateUrl: 'templates/incuna-surveys/form/calculate-percentage.html',
        link: function link(scope) {
            scope.percentageComplete = 0 + '%';
            var totalQuestionCount = 0;
            scope.$watch('questionSet', function (questions) {
                totalQuestionCount = CalculateCompletion.countQuestionsTotal(questions);
            });

            // Using true to compare the sub-elements.
            scope.$watch('model', function (answers) {
                if (totalQuestionCount === 0) {
                    return;
                }
                var numberOfCompletedQuestions = CalculateCompletion.countNumberOfAnsweredQuestions(answers, scope.questionSet);
                scope.percentageComplete = CalculateCompletion.calculatePercentageComplete(numberOfCompletedQuestions, totalQuestionCount);
            }, true);
        }
    };
}]);

exports.default = moduleProperties;
