(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('incuna-surveys-fields.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/incuna-surveys/fields/free-text.html',
    "<label>{{ to.fieldOptions.label }}</label><input type=text ng-model=model[to.fieldSetIndex].answers[options.key]>"
  );


  $templateCache.put('templates/incuna-surveys/fields/test.html',
    "<h1>WORKS</h1>"
  );

}]);

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var angular = exports.angular = window.angular;

},{}],3:[function(require,module,exports){
'use strict';

var _libraries = require('./libraries.js');

var _api = require('./services/api.js');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _module = _libraries.angular.module('incuna-surveys', [_api2.default.moduleName]);

},{"./libraries.js":2,"./services/api.js":5}],4:[function(require,module,exports){
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

},{"./../libraries.js":2}],5:[function(require,module,exports){
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

},{"./../libraries.js":2,"./../providers/project-config.js":4}],6:[function(require,module,exports){
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
        parseFields: function parseFields(form) {
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
                            fieldSetIndex: fieldset.id - 1,
                            choices: field.answers,
                            fieldOptions: {
                                help_text: field.help_text,
                                required: field.required,
                                label: field.name
                            }
                        }
                    };

                    fieldGroup.push(fieldObject);
                });

                fields.push({
                    fieldGroup: fieldGroup
                });
            });

            return fields;
        },
        parseModel: function parseModel(form) {
            var model = [];

            form.fieldsets.forEach(function (fieldset, index) {
                model.push({
                    fieldset: index + 1,
                    answers: {}
                });
            });

            return model;
        }
    };
};

var _module = ['Templates', FieldsetParserService];

exports.module = _module;
exports.default = _module;

},{}],7:[function(require,module,exports){

},{}],8:[function(require,module,exports){
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
            templateUrl: 'templates/incuna-surveys/fields/free-text.html'
        });

        formlyConfig.setType({
            name: 'number',
            template: '<label>{{ to.fieldOptions.label }}</label><input type="text" ng-model="model[to.fieldSetIndex].answers[options.key]">'
        });

        formlyConfig.setType({
            name: 'percentage',
            template: '<label>{{ to.fieldOptions.label }}</label><input type="text" ng-model="model[to.fieldSetIndex].answers[options.key]">'
        });

        formlyConfig.setType({
            name: 'checkbox',
            template: '<label>{{ to.fieldOptions.label }}</label><label ng-repeat="choice in to.choices">{{ choice }}<input type="checkbox" checklist-model="model[to.fieldSetIndex].answers[options.key]" checklist-value="choice"></label ng-repeat>'
        });

        formlyConfig.setType({
            name: 'radio',
            template: '<label>{{ to.fieldOptions.label }}</label><input type="text" ng-model="model[to.fieldSetIndex].answers[options.key]">'
        });

        this.fields = FieldsetParserService.parseFields(apiDesc);
        this.model = FieldsetParserService.parseModel(apiDesc);
    }]);
};

exports.module = _module;
exports.default = _module;

},{}]},{},[1,2,3,4,5,6,7,8]);
