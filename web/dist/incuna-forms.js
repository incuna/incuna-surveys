(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('incuna-surveys-fields.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/incuna-surveys/fields/checkbox.html',
    "<span>{{ to.fieldOptions.label }}</span><label ng-repeat=\"choice in to.choices\">{{ choice }}<input type=checkbox checklist-model=model[to.fieldSetIndex].answers[options.key] checklist-value=choice></label>'"
  );


  $templateCache.put('templates/incuna-surveys/fields/fieldset-header.html',
    "<h3>{{ to.fieldGroupName }}</h3><h4>{{ to.fieldGroupDesc }}</h4>"
  );


  $templateCache.put('templates/incuna-surveys/fields/free-text.html',
    "<div drf-form-field=to.fieldOptions id=options.key><input type=text ng-model=model[to.fieldSetIndex].answers[options.key]></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/header.html',
    "<h1>{{ to.formName }}</h1><h2>{{ to.formDescription }}</h2>"
  );


  $templateCache.put('templates/incuna-surveys/fields/number.html',
    "<div drf-form-field=to.fieldOptions id=options.key><input type=text ng-model=model[to.fieldSetIndex].answers[options.key]></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/percentage.html',
    "<div drf-form-field=to.fieldOptions id=options.key><div style=position:relative aif-slider-input model=model[to.fieldSetIndex].answers[options.key] ceiling=100></div></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/radio.html',
    "<div drf-form field=to.fieldOptions id=options.key><label ng-repeat=\"choice in to.choices\">{{ choice }}<input type=radio ng-value=choice ng-model=model[to.fieldSetIndex].answers[options.key]></label></div>"
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

var _fieldsetsParser = require('./services/fieldsets-parser.js');

var _fieldsetsParser2 = _interopRequireDefault(_fieldsetsParser);

var _api = require('./services/api.js');

var _api2 = _interopRequireDefault(_api);

var _projectConfig = require('./providers/project-config.js');

var _projectConfig2 = _interopRequireDefault(_projectConfig);

var _test = require('./test.js');

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_libraries.angular.module('incuna-surveys', ['incuna-surveys-fields.templates', 'drf-form-field', 'aif-slider-input']).service('FieldsetParserService', _fieldsetsParser2.default).provider('ProjectConfig', _projectConfig2.default).service('Api', _api2.default);

(0, _test2.default)();

},{"./libraries.js":2,"./providers/project-config.js":4,"./services/api.js":5,"./services/fieldsets-parser.js":7,"./test.js":8}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ProjectConfig = function ProjectConfig() {
    var settings = {
        apiRoot: 'localhost:8000'
    };

    return {
        $get: function $get() {
            return {
                getApiRoot: function getApiRoot() {
                    return settings.apiRoot;
                }
            };
        },
        setApiRoot: function setApiRoot(value) {
            settings.apiRoot = value;
        }
    };
};

var provider = exports.provider = [ProjectConfig];

exports.default = provider;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var api = exports.api = function api($http, ProjectConfig) {
    return {
        getBaseUrl: function getBaseUrl() {
            var endpoint = 'forms';
            var apiRoot = ProjectConfig.getApiRoot();
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

var service = exports.service = ['$http', 'ProjectConfig', api];

exports.default = service;

},{}],6:[function(require,module,exports){
'use strict';

var FieldsConfig = function FieldsConfig(formly) {
    return {
        templatesBase: 'templates/incuna-surveys/fields'
    };
};

module.run(function (formlyConfig, FieldsConfig) {
    var templatesBase = FieldsConfig.templatesBase;

    formlyConfig.setType({
        name: 'free_text',
        templateUrl: templatesBase + '/free-text.html'
    });

    formlyConfig.setType({
        name: 'number',
        templateUrl: templatesBase + '/number.html'
    });

    formlyConfig.setType({
        name: 'percentage',
        templateUrl: templatesBase + '/percentage.html'
    });

    formlyConfig.setType({
        name: 'checkbox',
        templateUrl: templatesBase + '/checkbox.html'
    });

    formlyConfig.setType({
        name: 'radio',
        templateUrl: templatesBase + '/radio.html'
    });
});

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
 *
 * This module parses a form API into an angular-formly array
 *
 */
var FieldsetParserService = exports.FieldsetParserService = function FieldsetParserService() {
    return {
        parseFields: function parseFields(form) {
            var fields = [];
            var templatesBase = 'templates/incuna-surveys/fields';

            fields[0] = {
                templateUrl: templatesBase + '/header.html',
                templateOptions: {
                    formName: form.name,
                    formDescription: form.description
                }
            };

            form.fieldsets.forEach(function (fieldset) {
                var fieldGroup = [{
                    templateUrl: templatesBase + '/fieldset-header.html',
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

var _module = [FieldsetParserService];

exports.module = _module;
exports.default = _module;

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

        this.fields = FieldsetParserService.parseFields(apiDesc);
        this.model = FieldsetParserService.parseModel(apiDesc);
    }]);
};

exports.module = _module;
exports.default = _module;

},{}]},{},[1,2,3,4,5,6,7,8]);
