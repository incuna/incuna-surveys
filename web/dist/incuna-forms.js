(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moduleProperties = undefined;

var _libraries = require('./../libraries.js');

var _api = require('./../services/api.js');

var _api2 = _interopRequireDefault(_api);

var _calculatePercentage = require('./../services/calculate-percentage.js');

var _calculatePercentage2 = _interopRequireDefault(_calculatePercentage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moduleProperties = exports.moduleProperties = {
    moduleName: 'incuna-surveys.calculate-percentage-directive'
};

var _module = _libraries.angular.module(moduleProperties.moduleName, [_api2.default.moduleName, _calculatePercentage2.default.moduleName]);

_module.directive('calculatePercentage', [_api2.default.componentName, _calculatePercentage2.default.componentName, function (API, CalculateCompletion) {
    return {
        restrict: 'A',
        scope: {
            questionSet: '=',
            model: '='
        },
        templateUrl: 'templates/incuna-surveys/form/calculate-percentage.html',
        link: function link(scope) {
            scope.percentageComplete = 0 + '%';
            var totalQuestionCount = 0;

            scope.$watch('questionSet', function (questions) {
                totalQuestionCount = CalculateCompletion.countQuestionsTotal(questions);
            });

            // Using true to compare the sub-elements.
            scope.$watch('model', function (answers) {
                var numberOfCompletedQuestions = CalculateCompletion.countNumberOfAnsweredQuestions(answers);
                scope.percentageComplete = CalculateCompletion.calculatePercentageComplete(numberOfCompletedQuestions, totalQuestionCount);
            }, true);
        }
    };
}]);

exports.default = moduleProperties;

},{"./../libraries.js":5,"./../services/api.js":8,"./../services/calculate-percentage.js":10}],2:[function(require,module,exports){
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
            responseUrl: '=',
            onSuccess: '&',
            onFailure: '&'
        },
        templateUrl: 'templates/incuna-surveys/form/survey-form.html',
        link: function link(scope) {
            scope.model = {};
            scope.$watch('formUrl', function (url) {
                if (url) {
                    API.getForm(url).then(function (structure) {
                        scope.form = structure;
                        scope.fields = FieldsetParser.parseFields(structure);
                        // Only set the empty model if the model has not
                        // been set.
                        if (Object.keys(scope.model).length === 0) {
                            scope.model = FieldsetParser.parseFormToModel(structure);
                        }
                    });
                }
            });

            scope.$watch('responseUrl', function (url) {
                if (url) {
                    API.get(url).then(function (data) {
                        scope.model = data;
                    });
                }
            });

            scope.submit = function () {
                if (scope.responseUrl) {
                    // TODO: Handle errors.
                    API.post(scope.responseUrl, scope.model).then(scope.onSuccess).catch(scope.onFailure);
                }
            };
        }
    };
}]);

exports.default = moduleProperties;

},{"./../libraries.js":5,"./../services/api.js":8,"./../services/fieldsets-parser.js":12}],3:[function(require,module,exports){
angular.module('incuna-surveys-fields.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/incuna-surveys/fields/checkbox.html',
    "<div drf-form-field=to.fieldOptions class=checkbox><div ng-repeat=\"choice in to.choices\" class=\"checkable checkbox\">{% raw %} <input class=checkbox-input id=\"{{ to.autoId }}-{{ $index }}\" type=checkbox checklist-model=model[to.fieldSetId][options.key] checklist-value=$index><label class=checkbox-label for=\"{{ to.autoId }}-{{ $index }}\" ng-bind=choice></label>{% endraw %}</div></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/free-text.html',
    "<div drf-form-field=to.fieldOptions class=\"text {% raw %}{{ model[to.fieldSetId][options.key] ? 'not-empty' : '' }}{% endraw %}\" field-id=to.autoId><input type=text class=text-input id=\"{% raw %}{{ to.autoId }}{% endraw %}\" ng-model=model[to.fieldSetId][options.key] ng-required=to.fieldOptions.required></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/number.html',
    "<div drf-form-field=to.fieldOptions class=\"number {% raw %}{{ model[to.fieldSetId][options.key] ? 'not-empty' : '' }}{% endraw %}\" field-id=to.autoId><input type=text class=number-input id=\"{% raw %}{{ to.autoId }}{% endraw %}\" ng-model=model[to.fieldSetId][options.key]></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/percentage.html',
    "<div drf-form-field=to.fieldOptions class=slider><div aif-slider-input model=model[to.fieldSetId][options.key] ceiling=100 slider-low-label=0% slider-high-label=100%></div></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/radio.html',
    "<div drf-form-field=to.fieldOptions class=radio><div ng-repeat=\"choice in to.choices\" class=\"checkable radio\">{% raw %} <input type=radio id=\"{{ to.autoId }}-{{ $index }}\" ng-value=$index ng-model=model[to.fieldSetId][options.key] ng-required=to.fieldOptions.required><label for=\"{{ to.autoId }}-{{ $index }}\" ng-bind=choice></label>{% endraw %}</div></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/wrapper.html',
    "{% raw %}<section class=\"form-section form-section-{{options.templateOptions.id}}\"><header class=form-section-header><h3 ng-bind=options.templateOptions.name class=form-section-name></h3><h4 ng-bind=options.templateOptions.description class=form-section-desc></h4></header><fieldset class=\"form-section-body content\"><formly-transclude></formly-transclude></fieldset></section>{% endraw %}"
  );

}]);

},{}],4:[function(require,module,exports){
angular.module('incuna-surveys-form.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/incuna-surveys/form/calculate-percentage.html',
    "<div ng-bind=percentageComplete></div>"
  );


  $templateCache.put('templates/incuna-surveys/form/survey-form.html',
    "<form class=question-form ng-submit=submit()><div calculate-percentage question-set=fields model=model></div><header class=form-header><h1 ng-bind=form.name class=form-name></h1><h2 ng-bind=form.description class=form-desc></h2></header><formly-form class=form-body model=model fields=fields></formly-form><button class=button-submit type=submit>Submit</button></form>"
  );

}]);

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var angular = exports.angular = window.angular;

},{}],6:[function(require,module,exports){
'use strict';

var _libraries = require('./libraries.js');

var _api = require('./services/api.js');

var _api2 = _interopRequireDefault(_api);

var _fieldsConfig = require('./services/fields-config.js');

var _fieldsConfig2 = _interopRequireDefault(_fieldsConfig);

var _form = require('./directives/form.js');

var _form2 = _interopRequireDefault(_form);

var _calculatePercentage = require('./directives/calculate-percentage.js');

var _calculatePercentage2 = _interopRequireDefault(_calculatePercentage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_libraries.angular.module('incuna-surveys', ['drf-form-field', 'aif-slider-input', 'checklist-model', _fieldsConfig2.default.moduleName, _api2.default.moduleName, _form2.default.moduleName, _calculatePercentage2.default.moduleName]);

},{"./directives/calculate-percentage.js":1,"./directives/form.js":2,"./libraries.js":5,"./services/api.js":8,"./services/fields-config.js":11}],7:[function(require,module,exports){
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

},{"./../libraries.js":5}],8:[function(require,module,exports){
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
        post: function post(url, data) {
            return $http.post(url, data).then(function (response) {
                return response.data;
            });
        }
    };
}]);

exports.default = moduleProperties;

},{"./../libraries.js":5,"./../providers/project-config.js":7}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moduleProperties = undefined;

var _libraries = require('./../libraries.js');

var moduleProperties = exports.moduleProperties = {
    moduleName: 'incuna-surveys.calculate-completion-percent',
    componentName: 'calculateCompletionPercent'
}; /*
    *
    * This module calculates the survey completion percentage/
    *
    */

var _module = _libraries.angular.module(moduleProperties.moduleName, []);

_module.service(moduleProperties.componentName, [function () {
    this.countQuestionsTotal = function (form) {
        var questions = form;
        var totalQuestionCount = 0;

        questions.forEach(function (question) {
            totalQuestionCount = totalQuestionCount + question.fields.length;
        });

        return totalQuestionCount;
    };

    // answers is an object containing objects
    // object {
    //     1 : {
    //         2 : 0
    //         3 : 0
    //     }
    // }
    // answered is a number of type number
    this.countNumberOfAnsweredQuestions = function (answers) {
        var answered = 0;

        for (var groupKey in answers) {
            var answerGroup = answers[groupKey];
            for (var answerKey in answerGroup) {
                var answer = answerGroup[answerKey];
                if (answer > 0 || answer.length > 0) {
                    answered++;
                }
            }
        }

        return answered;
    };

    this.calculatePercentageComplete = function (completedQuestions, totalQuestionCount) {
        var result = completedQuestions / totalQuestionCount * 100;
        if (result >= 0) {
            return Math.round(result) + '%';
        }

        return 0 + '%';
    };
}]);

exports.default = moduleProperties;

},{"./../libraries.js":5}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moduleProperties = undefined;

var _libraries = require('./../libraries.js');

var moduleProperties = exports.moduleProperties = {
    moduleName: 'incuna-surveys.calculate-completion-percent',
    componentName: 'calculateCompletionPercent'
}; /*
    *
    * This module calculates the survey completion percentage/
    *
    */

var _module = _libraries.angular.module(moduleProperties.moduleName, []);

_module.service(moduleProperties.componentName, [function () {
    this.countQuestionsTotal = function (form) {
        var questions = form;
        var totalQuestionCount = 0;

        _libraries.angular.forEach(questions, function (question) {
            totalQuestionCount = totalQuestionCount + question.fieldGroup.length;
        });

        return totalQuestionCount;
    };

    // answers is an object containing objects
    // object {
    //     1 : {
    //         2 : 0
    //         3 : 0
    //     }
    // }
    // answered is a number of type number
    this.countNumberOfAnsweredQuestions = function (answers) {
        var answered = 0;

        for (var groupKey in answers) {
            var answerGroup = answers[groupKey];
            for (var answerKey in answerGroup) {
                var answer = answerGroup[answerKey];
                if (answer > 0 || answer.length > 0) {
                    answered++;
                }
            }
        }

        return answered;
    };

    this.calculatePercentageComplete = function (completedQuestions, totalQuestionCount) {
        var result = completedQuestions / totalQuestionCount * 100;
        if (result >= 0) {
            return Math.round(result) + '%';
        }

        return 0 + '%';
    };
}]);

exports.default = moduleProperties;

},{"./../libraries.js":5}],11:[function(require,module,exports){
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

    formlyConfig.setWrapper([{
        name: 'panel',
        templateUrl: templatesBase + '/wrapper.html'
    }]);
}]);

exports.default = moduleProperties;

},{"./../libraries.js":5}],12:[function(require,module,exports){
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
    this.parseFields = function (form) {
        return form.fieldsets.map(function (fieldset) {
            return {
                wrapper: 'panel',
                templateOptions: fieldset,
                fieldGroup: fieldset.fields.map(function (field) {
                    return {
                        key: field.id,
                        type: field.field_type,
                        templateOptions: {
                            fieldSetId: fieldset.id,
                            autoId: 'id-' + fieldset.id + '-' + field.id,
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
                })
            };
        });
    };

    this.parseFormToModel = function (form) {
        var model = {};

        form.fieldsets.forEach(function (fieldset) {
            model[fieldset.id] = {};
        });

        return model;
    };
}]);

exports.default = moduleProperties;

},{"./../libraries.js":5}]},{},[1,2,3,4,5,6,7,8,9,10,11,12]);
