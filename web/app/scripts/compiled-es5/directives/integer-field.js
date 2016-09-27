'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _libraries = require('./../libraries.js');

var moduleProperties = {
    moduleName: 'incuna-surveys.integer-field-directive'
};

var _module = _libraries.angular.module(moduleProperties.moduleName, []);

_module.directive('ensureInteger', [function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function link(scope, element, attr, ctrl) {
            ctrl.$parsers.push(function (val) {
                if (!val) {
                    return null;
                }
                var value = parseInt(val, 10);
                if (Number.isNaN(value)) {
                    return undefined;
                }
                return value;
            });
        }
    };
}]);

_module.directive('integerField', [function () {
    return {
        templateUrl: 'templates/incuna-surveys/form/integer-field.html',
        scope: {
            form: '=',
            model: '=',
            id: '='
        }
    };
}]);

exports.default = moduleProperties;
