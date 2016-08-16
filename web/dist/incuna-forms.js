(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var angular = exports.angular = window.angular;

},{}],2:[function(require,module,exports){
'use strict';

var _libraries = require('./libraries.js');

var _api = require('./services/api.js');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_libraries.angular.module('incuna-surveys', [_api2.default.moduleName]);

},{"./libraries.js":1,"./services/api.js":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.module = undefined;

var _libraries = require('./../libraries.js');

var ProjectConfig = function ProjectConfig() {
    var settings = {
        apiRoot: 'localhost:8000'
    };

    return {
        $get: function $get() {
            return {
                getSettings: function getSettings() {
                    return settings;
                }
            };
        },
        setApiRoot: function setApiRoot(value) {
            settings.apiRoot = value;
        }
    };
};

var _module = {
    moduleName: 'incuna.surveys-config',
    componentName: 'ProjectConfig'
};

exports.module = _module;
_libraries.angular.module(_module.moduleName, []).provider(_module.componentName, [ProjectConfig]);

exports.default = _module;

},{"./../libraries.js":1}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.module = exports.API = undefined;

var _libraries = require('./../libraries.js');

var _projectConfig = require('./../providers/project-config.js');

var _projectConfig2 = _interopRequireDefault(_projectConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var API = exports.API = function API($http, ProjectConfig) {
    return {
        getBaseUrl: function getBaseUrl() {
            var endpoint = 'forms';
            var apiRoot = ProjectConfig.getSettings().apiRoot;
            return apiRoot + '/' + endpoint;
        },
        getList: function getList() {
            var url = this.getBaseUrl();

            return $http.get(url).then(function (response) {
                return response.data;
            });
        },
        getForm: function getForm(url) {
            return $http.get(url).then(function (response) {
                return response.data;
            });
        }
    };
};

var _module = {
    moduleName: 'incuna.surveys-api',
    componentName: 'API'
};

exports.module = _module;
_libraries.angular.module(_module.moduleName, [_projectConfig2.default.moduleName]).service(['$http', _projectConfig2.default.componentName, API]);

exports.default = _module;

},{"./../libraries.js":1,"./../providers/project-config.js":3}]},{},[1,2,3,4]);
