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

var _module = _libraries.angular.module(moduleProperties.moduleName, [_api2.default.moduleName, _fieldsetsParser2.default.moduleName, 'incuna-surveys-form.templates']);

_module.directive('surveysForm', [_api2.default.componentName, _fieldsetsParser2.default.componentName, function (API, FieldsetParser) {
    return {
        restrict: 'A',
        scope: {
            formUrl: '=',
            responseUrl: '='
        },
        templateUrl: 'templates/incuna-surveys/form/survey-form.html',
        link: function link($scope) {
            $scope.model = {};
            $scope.$watch('formUrl', function (url) {
                if (url) {
                    API.getForm(url).then(function (structure) {
                        $scope.fields = FieldsetParser.parseFields(structure);
                        // Only set the empty model if the model has not
                        // been set.
                        if (Object.keys($scope.model).length === 0) {
                            $scope.model = FieldsetParser.parseFormToModel(structure);
                        }
                    });
                }
            });

            $scope.$watch('responseUrl', function (url) {
                if (url) {
                    API.get(url).then(function (data) {
                        $scope.model = data;
                    });
                }
            });

            $scope.submit = function () {
                if ($scope.responseUrl) {
                    // TODO: Handle errors.
                    var responses = FieldsetParser.parseModelToResponse($scope.model);
                    API.post($scope.responseUrl, responses);
                }
            };
        }
    };
}]);

exports.default = moduleProperties;
