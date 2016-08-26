(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var _module = _libraries.angular.module(moduleProperties.moduleName, [_api2.default.moduleName, _fieldsetsParser2.default.moduleName]);

_module.directive('surveysForm', [_api2.default.componentName, _fieldsetsParser2.default.componentName, function (API, FieldsetParser) {
    return {
        restrict: 'A',
        scope: {
            formUrl: '=',
            responseUrl: '='
        },
        templateUrl: 'templates/incuna-surveys/survey-form.html',
        link: function link($scope) {
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
                        $scope.model = FieldsetParser.parseResponseToModel(data);
                    });
                }
            });

            $scope.submit = function () {
                if ($scope.responseUrl) {
                    // TODO: Handle errors.
                    API.post($scope.responseUrl, $scope.model);
                }
            };

            $scope.submit();
        }
    };
}]);

exports.default = moduleProperties;

},{"./../libraries.js":3,"./../services/api.js":6,"./../services/fieldsets-parser.js":8}],2:[function(require,module,exports){
angular.module('incuna-surveys-fields.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/incuna-surveys/fields/checkbox.html',
    "<div drf-form-field=to.fieldOptions field-id=options.key class=checkbox><div ng-repeat=\"choice in to.choices\" class=\"checkable checkbox\"><input class=checkbox-input id=\"{{ options.key }}-{{ $index }}\" type=checkbox checklist-model=model[to.fieldSetIndex].answers[options.key] checklist-value=$index><label class=checkbox-label for=\"{{ options.key }}-{{ $index }}\">{{ choice }}</label></div></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/fieldset-header.html',
    "<h3>{{ to.fieldGroupName }}</h3><h4>{{ to.fieldGroupDesc }}</h4>"
  );


  $templateCache.put('templates/incuna-surveys/fields/free-text.html',
    "<div drf-form-field=to.fieldOptions class=text field-id=options.key><input type=text class=text-input id=\"{{ options.key }}\" ng-model=model[to.fieldSetIndex].answers[options.key] ng-required=to.fieldOptions.required></div>"
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
    "<div drf-form field=to.fieldOptions class=radio><div ng-repeat=\"choice in to.choices\" class=\"checkable radio\"><input type=radio id=\"{{ options.key }}-{{ $index }}\" ng-value=$index ng-model=model[to.fieldSetIndex].answers[options.key] ng-required=to.fieldOptions.required><label for=\"{{ options.key }}-{{ $index }}\">{{ choice }}</label></div></div>"
  );

}]);

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var angular = exports.angular = window.angular;

},{}],4:[function(require,module,exports){
'use strict';

var _libraries = require('./libraries.js');

var _api = require('./services/api.js');

var _api2 = _interopRequireDefault(_api);

var _fieldsConfig = require('./services/fields-config.js');

var _fieldsConfig2 = _interopRequireDefault(_fieldsConfig);

var _form = require('./directives/form.js');

var _form2 = _interopRequireDefault(_form);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_libraries.angular.module('incuna-surveys', ['drf-form-field', 'aif-slider-input', 'checklist-model', _fieldsConfig2.default.moduleName, _api2.default.moduleName, _form2.default.moduleName]);

},{"./directives/form.js":1,"./libraries.js":3,"./services/api.js":6,"./services/fields-config.js":7}],5:[function(require,module,exports){
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

},{"./../libraries.js":3}],6:[function(require,module,exports){
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
        },
        get: function get(url) {
            return $http.get(url).then(function (response) {
                return response.data;
            });
        },
        post: function post(url, responses) {
            var data = {
                // jscs:disable disallowQuotedKeysInObjects
                'user_responses': responses
                // jscs:enable disallowQuotedKeysInObjects
            };
            return $http.post(url, data).then(function (response) {
                return response.data;
            });
        }
    };
}]);

exports.default = moduleProperties;

},{"./../libraries.js":3,"./../providers/project-config.js":5}],7:[function(require,module,exports){
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

},{"./../libraries.js":3}],8:[function(require,module,exports){
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

    this.parseFormToModel = function (form) {
        var model = [];

        form.fieldsets.forEach(function (fieldset, index) {
            model.push({
                fieldset: fieldset.id,
                answers: {}
            });
        });

        return model;
    };

    this.parseResponseToModel = function (data) {
        var model = [];

        Object.keys(data).forEach(function (id, index) {
            model.push({
                fieldset: id,
                answers: data[id]
            });
        });

        return model;
    };
}]);

exports.default = moduleProperties;

},{"./../libraries.js":3,"./fields-config.js":7}],9:[function(require,module,exports){

},{}]},{},[1,2,3,4,5,6,7,8,9]);
