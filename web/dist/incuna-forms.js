(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('incuna-surveys-fields.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/incuna-surveys/fields/checkbox.html',
    "<div drf-form-field=to.fieldOptions field-id=options.key class=checkbox><div ng-repeat=\"choice in to.choices\" class=\"checkable checkbox\"><input class=checkbox-input id=\"{{ options.key + '-' + $index }}\" type=checkbox checklist-model=model[to.fieldSetIndex].answers[options.key] checklist-value=$index><label class=checkbox-label for=\"{{ options.key + '-' + $index }}\">{{ choice }}</label></div></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/fieldset-header.html',
    "<h3>{{ to.fieldGroupName }}</h3><h4>{{ to.fieldGroupDesc }}</h4>"
  );


  $templateCache.put('templates/incuna-surveys/fields/free-text.html',
    "<div drf-form-field=to.fieldOptions class=text field-id=options.key><input type=text class=text-input id=\"{{ options.key }}\" ng-model=model[to.fieldSetIndex].answers[options.key]></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/header.html',
    "<h1>{{ to.formName }}</h1><h2>{{ to.formDescription }}</h2>"
  );


  $templateCache.put('templates/incuna-surveys/fields/number.html',
    "<div drf-form-field=to.fieldOptions class=number field-id=options.key><input type=text class=number-input id=\"{{ options.key }}\" ng-model=model[to.fieldSetIndex].answers[options.key]></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/percentage.html',
    "<div drf-form-field=to.fieldOptions field-id=options.key class=slider><div aif-slider-input model=model[to.fieldSetIndex].answers[options.key] ceiling=100 slider-low-label=0% slider-high-label=100%></div></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/radio.html',
    "<div drf-form field=to.fieldOptions class=radio><div ng-repeat=\"choice in to.choices\" class=\"checkable radio\"><input type=radio id=\"{{ options.key + '-' + $index }}\" ng-value=$index ng-model=model[to.fieldSetIndex].answers[options.key]><label for=\"{{ options.key  + '-' + $index }}\">{{ choice }}</label></div></div>"
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

var _fieldsConfig = require('./services/fields-config.js');

var _fieldsConfig2 = _interopRequireDefault(_fieldsConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_libraries.angular.module('incuna-surveys', ['drf-form-field', 'aif-slider-input', 'checklist-model', _fieldsConfig2.default.moduleName, _fieldsetsParser2.default.moduleName, _api2.default.moduleName]);

},{"./libraries.js":2,"./services/api.js":5,"./services/fields-config.js":6,"./services/fieldsets-parser.js":7}],4:[function(require,module,exports){
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

},{"./../libraries.js":2}],5:[function(require,module,exports){
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

},{"./../libraries.js":2,"./../providers/project-config.js":4}],6:[function(require,module,exports){
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

var _module = _libraries.angular.module(moduleProperties.moduleName, ['formly']);

_module.service(moduleProperties.componentName, [function () {
    this.templatesBase = 'templates/incuna-surveys/fields';
    this.headerTemplateUrl = this.templatesBase + '/header.html';
    this.fieldsetHeaderTemplateUrl = this.templatesBase + '/fieldset-header.html';
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

},{"./../libraries.js":2}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moduleProperties = undefined;

var _libraries = require('./../libraries.js');

var _fieldsConfig = require('./fields-config.js');

var _fieldsConfig2 = _interopRequireDefault(_fieldsConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 *
 * This module parses a form API into an angular-formly array
 *
 */

var moduleProperties = exports.moduleProperties = {
    moduleName: 'incuna-surveys.field-parser',
    componentName: 'FieldsParser'
};

var _module = _libraries.angular.module(moduleProperties.moduleName, [_fieldsConfig2.default.moduleName]);

_module.service(moduleProperties.componentName, [_fieldsConfig2.default.componentName, function (FieldsConfig) {
    this.parseFields = function (form) {
        var fields = [];

        fields[0] = {
            templateUrl: FieldsConfig.headerTemplateUrl,
            templateOptions: {
                formName: form.name,
                formDescription: form.description
            }
        };

        form.fieldsets.forEach(function (fieldset) {
            var fieldGroup = [{
                templateUrl: FieldsConfig.fieldsetHeaderTemplateUrl,
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
                            // jscs:disable disallowQuotedKeysInObjects
                            'help_text': field.help_text,
                            required: field.required,
                            label: field.name
                            // jscs:enable disallowQuotedKeysInObjects
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
    };

    this.parseModel = function (form) {
        var model = [];

        form.fieldsets.forEach(function (fieldset, index) {
            model.push({
                fieldset: index + 1,
                answers: {}
            });
        });

        return model;
    };
}]);

exports.default = moduleProperties;

},{"./../libraries.js":2,"./fields-config.js":6}],8:[function(require,module,exports){
'use strict';

var apiDesc = {
    /* jscs:disable disallowQuotedKeysInObjects */
    'name': 'How have you been using the site?',
    'description': 'Form description',
    'url': 'http://localhost:8000/forms/1',
    'fieldsets': [{
        'id': 1,
        'name': 'Free text field',
        'description': 'Some additional text expanding on the above',
        'fields': [{
            'id': 1,
            'name': 'How did you discover the site?',
            'help_text': 'Search engine, friend...',
            'field_type': 'free_text',
            'required': true,
            'answers': []
        }]
    }, {
        'id': 2,
        'name': 'Numeric fields',
        'description': 'Some additional text expanding on the above',
        'fields': [{
            'id': 2,
            'name': 'What is answer to the ultimate question of life, the universe, and everything?',
            'help_text': null,
            'field_type': 'number',
            'required': false,
            'answers': []
        }, {
            'id': 3,
            'name': 'How much percentage does it take?',
            'help_text': null,
            'field_type': 'percentage',
            'required': true,
            'answers': []
        }]
    }, {
        'id': 3,
        'name': 'Choice fields',
        'description': 'Some additional text expanding on the above',
        'fields': [{
            'id': 4,
            'name': 'How many time do you visit the site per day?',
            'help_text': 'Choose a valid answer.',
            'field_type': 'radio',
            'required': true,
            'answers': ['One time', 'Two times', 'Three times or more']
        }, {
            'id': 5,
            'name': 'Choose more than one answer.',
            'help_text': null,
            'field_type': 'checkbox',
            'required': false,
            'answers': ['One time', 'Two times', 'Three times or more']
        }]
    }]
    /* jscs:enable disallowQuotedKeysInObjects */
};

angular.module('test-app', ['incuna-surveys']).controller('FormCtrl', ['formlyConfig', 'FieldsParser', function (formlyConfig, FieldsetParserService) {

    this.fields = FieldsetParserService.parseFields(apiDesc);
    this.model = FieldsetParserService.parseModel(apiDesc);
}]);

},{}]},{},[1,2,3,4,5,6,7,8]);
