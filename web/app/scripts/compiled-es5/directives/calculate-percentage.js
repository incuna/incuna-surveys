'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moduleProperties = undefined;

var _libraries = require('./../libraries.js');

var _api = require('./../services/api.js');

var _api2 = _interopRequireDefault(_api);

var _calculatePercentage = require('./../services/calculate-percentage.js');

var _calculatePercentage2 = _interopRequireDefault(_calculatePercentage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moduleProperties = exports.moduleProperties = {
    moduleName: 'incuna-surveys.calculate-percentage-directive'
};

var _module = _libraries.angular.module(moduleProperties.moduleName, [_api2.default.moduleName, _calculatePercentage2.default.moduleName]);

_module.directive('calculatePercentage', [_api2.default.componentName, _calculatePercentage2.default.componentName, function (API, CalculateCompletion) {
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
                var numberOfCompletedQuestions = CalculateCompletion.countNumberOfAnsweredQuestions(answers);
                scope.percentageComplete = CalculateCompletion.calculatePercentageComplete(numberOfCompletedQuestions, totalQuestionCount);
            }, true);
        }
    };
}]);

exports.default = moduleProperties;
