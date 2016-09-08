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

var _calculatePercentageComplete = require('./../services/calculate-percentage-complete.js');

var _calculatePercentageComplete2 = _interopRequireDefault(_calculatePercentageComplete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moduleProperties = exports.moduleProperties = {
    moduleName: 'incuna-surveys.form-directive'
};

var _module = _libraries.angular.module(moduleProperties.moduleName, [_api2.default.moduleName, _fieldsetsParser2.default.moduleName, _calculatePercentageComplete2.default.moduleName]);

_module.directive('surveysForm', [_api2.default.componentName, _fieldsetsParser2.default.componentName, _calculatePercentageComplete2.default.componentName, function (API, FieldsetParser, CalculateCompletion) {
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
            scope.percentageComplete = 0 + '%';
            var totalQuestionCount = 0;

            scope.$watch('formUrl', function (url) {
                if (url) {
                    API.getForm(url).then(function (structure) {
                        scope.form = structure;
                        scope.fields = FieldsetParser.parseFields(structure);
                        // Only set the empty model if the model has not
                        // been set.
                        if (Object.keys(scope.model).length === 0) {
                            scope.model = FieldsetParser.parseFormToModel(structure);
                            totalQuestionCount = CalculateCompletion.countQuestionsTotal(scope.form.fieldsets);
                            console.log('hi', totalQuestionCount);
                        }
                    });
                }
            });

            // Using true to compare the sub-elements.
            scope.$watch('model', function (answers) {
                var numberOfCompletedQuestions = CalculateCompletion.countNumberOfAnsweredQuestions(answers);
                scope.percentageComplete = CalculateCompletion.calculatePercentageComplete(numberOfCompletedQuestions, totalQuestionCount);
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
                    API.post(scope.responseUrl, scope.model).then(scope.onSuccess).catch(scope.onFailure);
                }
            };
        }
    };
}]);

exports.default = moduleProperties;
