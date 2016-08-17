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

var _api = require('./services/api.js');

var _api2 = _interopRequireDefault(_api);

var _fieldsConfig = require('./services/fields-config.js');

var _fieldsConfig2 = _interopRequireDefault(_fieldsConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_libraries.angular.module('incuna-surveys', ['drf-form-field', 'aif-slider-input', 'checklist-model', _fieldsConfig2.default.moduleName, _fieldsetsParser2.default.moduleName, _api2.default.moduleName]);

},{"./libraries.js":1,"./services/api.js":4,"./services/fields-config.js":5,"./services/fieldsets-parser.js":6}],3:[function(require,module,exports){
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

},{"./../libraries.js":1}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moduleProperties = undefined;

var _libraries = require('./../libraries.js');

var _projectConfig = require('./../providers/project-config.js');

var _projectConfig2 = _interopRequireDefault(_projectConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moduleProperties = exports.moduleProperties = {
    moduleName: 'incuna-surveys.api',
    componentName: 'API'
};

var _module = _libraries.angular.module(moduleProperties.moduleName, [_projectConfig2.default.moduleName]);

_module.service(moduleProperties.componentName, ['$http', _projectConfig2.default.componentName, function ($http, ProjectConfig) {
    return {
        getBaseUrl: function getBaseUrl() {
            var endpoint = 'forms';
            var apiRoot = ProjectConfig.apiRoot;
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
}]);

exports.default = moduleProperties;

},{"./../libraries.js":1,"./../providers/project-config.js":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moduleProperties = undefined;

var _libraries = require('./../libraries.js');

var moduleProperties = exports.moduleProperties = {
    moduleName: 'incuna-surveys.formly-config',
    componentName: 'FieldsConfig'
};

var _module = _libraries.angular.module('incuna-surveys.formly-config', ['formly']);

_module.service('FieldsConfig', [function () {
    return {
        templatesBase: 'templates/incuna-surveys/fields'
    };
}]);

_module.run(['formlyConfig', moduleProperties.componentName, function (formlyConfig, FieldsConfig) {
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
}]);

exports.default = moduleProperties;

},{"./../libraries.js":1}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moduleProperties = undefined;

var _libraries = require('./../libraries.js');

var moduleProperties = exports.moduleProperties = {
    moduleName: 'incuna-surveys.field-parser',
    componentName: 'FieldsParser'
}; /*
    *
    * This module parses a form API into an angular-formly array
    *
    */

var _module = _libraries.angular.module(moduleProperties.moduleName, []);

_module.service(moduleProperties.componentName, [function () {
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
}]);

exports.default = moduleProperties;

},{"./../libraries.js":1}],7:[function(require,module,exports){
"use strict";

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

angular.module('test-app', ['incuna-surveys']).controller('FormCtrl', ['formlyConfig', 'FieldsParser', function (formlyConfig, FieldsetParserService) {

    this.fields = FieldsetParserService.parseFields(apiDesc);
    this.model = FieldsetParserService.parseModel(apiDesc);
}]);

},{}]},{},[1,2,3,4,5,6,7]);
