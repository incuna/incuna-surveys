(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var angular = exports.angular = window.angular;

},{}],2:[function(require,module,exports){
'use strict';

var _libraries = require('./libraries.js');

var _test = require('./test.js');

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global console */
// TODO: remove the following two lines
(0, _test2.default)();
/* eslint no-console: 0 */

},{"./libraries.js":1,"./test.js":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var api = exports.api = function api($http, PROJECT_SETTINGS) {
    return {
        getBaseUrl: function getBaseUrl() {
            var endpoint = 'forms';
            return PROJECT_SETTINGS.API_ROOT + '/' + endpoint;
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

var service = exports.service = ['$http', 'PROJECT_SETTINGS', api];

exports.default = module;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// TODO: remove this file, it is only proof of concept

var _module = function _module() {
    angular.module('test-app', ['formly']).controller('FormCtrl', ['formlyConfig', function (formlyConfig) {
        formlyConfig.setType({
            name: 'input',
            template: '<label>{{ to.label }}</label><input type="text" ng-model="model[options.key]">'
        });

        this.model = {};

        this.fields = [{
            fieldGroup: [{
                key: 'one',
                type: 'input',
                templateOptions: {
                    label: 'Blabla'
                }
            }]
        }, {
            template: '<hr>{{ to.test }}<hr>',
            templateOptions: {
                test: 'X'
            }
        }, {
            fieldGroup: [{
                key: 'two',
                type: 'input',
                templateOptions: {
                    label: 'Ugabuga'
                }
            }]
        }];
    }]);
};

exports.module = _module;
exports.default = _module;

},{}]},{},[1,2,3,4]);
