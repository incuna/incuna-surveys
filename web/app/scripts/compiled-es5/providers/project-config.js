'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moduleProperties = undefined;

var _libraries = require('./../libraries.js');

var moduleProperties = exports.moduleProperties = {
    moduleName: 'incuna-surveys.config',
    componentName: 'ProjectConfig'
};

var _module = _libraries.angular.module(moduleProperties.moduleName, []);

_module.provider(moduleProperties.componentName, [function () {
    var settings = {
        apiRoot: 'localhost:8000'
    };

    return {
        $get: function $get() {
            return settings;
        },
        setApiRoot: function setApiRoot(value) {
            settings.apiRoot = value;
        }
    };
}]);

exports.default = moduleProperties;
