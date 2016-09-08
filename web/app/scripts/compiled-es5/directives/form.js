'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moduleProperties = undefined;

var _libraries = require('./../libraries.js');

var _api = require('./../services/api.js');

var _api2 = _interopRequireDefault(_api);

var _fieldsetsParser = require('./../services/fieldsets-parser.js');

var _fieldsetsParser2 = _interopRequireDefault(_fieldsetsParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moduleProperties = exports.moduleProperties = {
    moduleName: 'incuna-surveys.form-directive'
};

var _module = _libraries.angular.module(moduleProperties.moduleName, [_api2.default.moduleName, _fieldsetsParser2.default.moduleName]);

_module.directive('surveysForm', [_api2.default.componentName, _fieldsetsParser2.default.componentName, function (API, FieldsetParser) {
    return {
        restrict: 'A',
        scope: {
            formUrl: '=',
            responseUrl: '=',
            onSuccess: '&',
            onFailure: '&'
        },
        templateUrl: 'templates/incuna-surveys/form/survey-form.html',
        link: function link(scope) {
            scope.model = {};
            scope.percentageComplete = 0;

            var getTotalQuestions = function getTotalQuestions() {
                var questions = scope.form.fieldsets;
                scope.totalQuestionCount = 0;

                _libraries.angular.forEach(questions, function (question) {
                    scope.totalQuestionCount = scope.totalQuestionCount + question.fields.length;
                });
            };

            scope.$watch('formUrl', function (url) {
                if (url) {
                    API.getForm(url).then(function (structure) {
                        scope.form = structure;
                        scope.fields = FieldsetParser.parseFields(structure);
                        // Only set the empty model if the model has not
                        // been set.
                        if (Object.keys(scope.model).length === 0) {
                            scope.model = FieldsetParser.parseFormToModel(structure);
                            getTotalQuestions();
                        }
                    });
                }
            });

            var checkAnswered = function checkAnswered(answers) {
                var answered = 0;
                _libraries.angular.forEach(answers, function (answerGroup) {
                    _libraries.angular.forEach(answerGroup, function (item) {
                        if (item > 0 || item.length > 0) {
                            answered = answered + 1;
                        }
                    });
                });

                return answered;
            };

            var calculatePercentageComplete = function calculatePercentageComplete(completedQuestions) {
                var result = completedQuestions / scope.totalQuestionCount * 100;
                scope.percentageComplete = Math.round(result);
            };

            scope.$watch('model', function (answers) {
                var completedQuestions = checkAnswered(answers);
                calculatePercentageComplete(completedQuestions);
            }, true);

            scope.$watch('responseUrl', function (url) {
                if (url) {
                    API.get(url).then(function (data) {
                        scope.model = data;
                    });
                }
            });

            scope.submit = function () {
                if (scope.responseUrl) {
                    // TODO: Handle errors.
                    var responses = FieldsetParser.parseModelToResponse(scope.model);
                    API.post(scope.responseUrl, responses).then(scope.onSuccess).catch(scope.onFailure);
                }
            };
        }
    };
}]);

exports.default = moduleProperties;
