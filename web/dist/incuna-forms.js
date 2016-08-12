(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var angular = exports.angular = window.angular;

},{}],2:[function(require,module,exports){
'use strict';

var _libraries = require('./libraries.js');

var _fieldsetsParser = require('./services/fieldsets-parser.js');

var _fieldsetsParser2 = _interopRequireDefault(_fieldsetsParser);

var _test = require('./test.js');

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_libraries.angular.module('incuna-surveys', []).service('FieldsetParserService', _fieldsetsParser2.default).service('Templates', function () {
    return {
        header: '<h1></h1>',
        fieldHeader: '<h2></h2>'
    };
}); /* global console */
// TODO: remove the following two lines

(0, _test2.default)();
/* eslint no-console: 0 */

},{"./libraries.js":1,"./services/fieldsets-parser.js":4,"./test.js":5}],3:[function(require,module,exports){
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
/*
 *
 * This module parses a form API into an angular-formly array
 *
 */
var FieldsetParserService = exports.FieldsetParserService = function FieldsetParserService(Templates) {
    return {
        parseFieldsets: function parseFieldsets(form) {
            var fields = [];

            fields[0] = {
                template: Templates.header,
                templateOptions: {
                    formName: form.name,
                    formDescription: form.description
                }
            };

            form.fieldsets.forEach(function (fieldset) {
                var fieldGroup = [{
                    template: Templates.fieldHeader,
                    templateOptions: {
                        fieldGroupName: fieldset.name,
                        fieldGroupDesc: fieldset.description
                    }
                }];

                fieldset.fields.forEach(function (field) {
                    var fieldObject = {
                        key: field.id,
                        type: field.field_type,
                        templateOptions: {
                            label: field.name,
                            fieldSetIndex: fieldset.id - 1,
                            choices: ['One', 'Two', 'Three']
                        }
                    };

                    fieldGroup.push(fieldObject);
                });

                fields.push({
                    fieldGroup: fieldGroup
                });
            });

            return {
                fields: fields
            };
        }
    };
};

var _module = ['Templates', FieldsetParserService];

exports.module = _module;
exports.default = _module;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// TODO: remove this file, it is only proof of concept

var apiDesc = {
    "name": "How have you been using the site?",
    "description": "Form description",
    "url": "http://localhost:8000/forms/1",
    "fieldsets": [{
        "id": 1,
        "name": "Free text field",
        "description": "Some additional text expanding on the above",
        "fields": [{
            "id": 1,
            "name": "How did you discover the site?",
            "help_text": "Search engine, friend...",
            "field_type": "free_text",
            "required": true,
            "answers": []
        }]
    }, {
        "id": 2,
        "name": "Numeric fields",
        "description": "Some additional text expanding on the above",
        "fields": [{
            "id": 2,
            "name": "What is answer to the ultimate question of life, the universe, and everything?",
            "help_text": null,
            "field_type": "number",
            "required": false,
            "answers": []
        }, {
            "id": 3,
            "name": "How much percentage does it take?",
            "help_text": null,
            "field_type": "percentage",
            "required": true,
            "answers": []
        }]
    }, {
        "id": 3,
        "name": "Choice fields",
        "description": "Some additional text expanding on the above",
        "fields": [{
            "id": 4,
            "name": "How many time do you visit the site per day?",
            "help_text": "Choose a valid answer.",
            "field_type": "radio",
            "required": true,
            "answers": ["One time", "Two times", "Three times or more"]
        }, {
            "id": 5,
            "name": "Choose more than one answer.",
            "help_text": null,
            "field_type": "checkbox",
            "required": false,
            "answers": ["One time", "Two times", "Three times or more"]
        }]
    }]
};

var _module = function _module() {
    angular.module('test-app', ['formly', 'incuna-surveys', 'checklist-model']).controller('FormCtrl', ['formlyConfig', 'FieldsetParserService', function (formlyConfig, FieldsetParserService) {

        formlyConfig.setType({
            name: 'free_text',
            template: '<label>{{ to.label }}</label><input type="text" ng-model="model[to.fieldSetIndex].answers[options.key]">'
        });

        formlyConfig.setType({
            name: 'number',
            template: '<label>{{ to.label }}</label><input type="text" ng-model="model[to.fieldSetIndex].answers[options.key]">'
        });

        formlyConfig.setType({
            name: 'percentage',
            template: '<label>{{ to.label }}</label><input type="text" ng-model="model[to.fieldSetIndex].answers[options.key]">'
        });

        formlyConfig.setType({
            name: 'checkbox',
            template: '<label>{{ to.label }}</label><label ng-repeat="choice in to.choices">{{ choice }}<input type="checkbox" checklist-model="model[to.fieldSetIndex].answers[options.key]" checklist-value="choice"></label ng-repeat>'
        });

        formlyConfig.setType({
            name: 'radio',
            template: '<label>{{ to.label }}</label><input type="text" ng-model="model[to.fieldSetIndex].answers[options.key]">'
        });

        this.model = [{
            fieldset: 1,
            answers: {}
        }, {
            fieldset: 2,
            answers: {}
        }, {
            fieldset: 3,
            answers: {}
        }];

        this.fields = FieldsetParserService.parseFieldsets(apiDesc);

        /*this.fields = [
            {
                template: '<h1>{{ to.formTitle }}</h1><h2>{{ to.formDescription }}</h2>',
                templateOptions: {
                    formTitle: apiDesc.name,
                    formDescription: apiDesc.description
                }
            },
            {
                fieldGroup: [
                    {
                        template: '<h3>{{ to.fieldGroupTitle }}</h3><h4>{{ to.fieldGroupDesc }}</h4>',
                        templateOptions: {
                            fieldGroupTitle: apiDesc.fieldsets[0].name,
                            fieldGroupDesc: apiDesc.fieldsets[0].description
                        },
                    },
                    {
                        key: apiDesc.fieldsets[0].fields[0].id,
                        type: apiDesc.fieldsets[0].fields[0].field_type,
                        templateOptions: {
                            label: 'Blabla',
                            index: apiDesc.fieldsets[0].id - 1
                        },
                    }
                ]
            },
        ];*/
    }]);
};

exports.module = _module;
exports.default = _module;

},{}]},{},[1,2,3,4,5]);
