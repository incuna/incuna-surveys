(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moduleProperties = undefined;

var _libraries = require('./../libraries.js');

var _calculatePercentage = require('./../services/calculate-percentage.js');

var _calculatePercentage2 = _interopRequireDefault(_calculatePercentage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moduleProperties = exports.moduleProperties = {
    moduleName: 'incuna-surveys.calculate-percentage-directive'
};

var _module = _libraries.angular.module(moduleProperties.moduleName, [_calculatePercentage2.default.moduleName]);

_module.directive('calculatePercentage', [_calculatePercentage2.default.componentName, function (CalculateCompletion) {
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
            var importantQuestionKeys = null;
            scope.$watch('questionSet', function (questions) {
                importantQuestionKeys = CalculateCompletion.getImportantQuestionKeys(questions);
                totalQuestionCount = importantQuestionKeys.length;
            });

            // Using true to compare the sub-elements.
            scope.$watch('model', function (answers) {
                if (totalQuestionCount === 0) {
                    return;
                }
                var numberOfCompletedQuestions = CalculateCompletion.countNumberOfAnsweredQuestions(answers, importantQuestionKeys);
                scope.percentageComplete = CalculateCompletion.calculatePercentageComplete(numberOfCompletedQuestions, totalQuestionCount);
            }, true);
        }
    };
}]);

exports.default = moduleProperties;

},{"./../libraries.js":7,"./../services/calculate-percentage.js":11}],2:[function(require,module,exports){
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
                    API.get(url).then(function (structure) {
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
                    API.post(scope.responseUrl, scope.model).then(function () {
                        FieldsetParser.addFieldErrors(scope.fields, {});
                        scope.onSuccess();
                    }).catch(function (response) {
                        var errors = response && response.data;
                        FieldsetParser.addFieldErrors(scope.fields, errors);
                        scope.onFailure();
                    });
                }
            };
        }
    };
}]);

exports.default = moduleProperties;

},{"./../libraries.js":7,"./../services/api.js":10,"./../services/fieldsets-parser.js":13}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _libraries = require('./../libraries.js');

var moduleProperties = {
    moduleName: 'incuna-surveys.integer-field-directive'
};

var _module = _libraries.angular.module(moduleProperties.moduleName, []);

_module.directive('ensureInteger', [function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function link(scope, element, attr, ctrl) {
            ctrl.$parsers.push(function (val) {
                if (!val) {
                    return null;
                }
                var value = parseInt(val, 10);
                if (Number.isNaN(value)) {
                    return undefined;
                }
                return value;
            });
        }
    };
}]);

_module.directive('integerField', [function () {
    return {
        templateUrl: 'templates/incuna-surveys/form/integer-field.html',
        scope: {
            form: '=',
            model: '=',
            id: '='
        }
    };
}]);

exports.default = moduleProperties;

},{"./../libraries.js":7}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _libraries = require('./../libraries.js');

var _proportionField = require('./../services/proportion-field.js');

var _proportionField2 = _interopRequireDefault(_proportionField);

var _integerField = require('./integer-field.js');

var _integerField2 = _interopRequireDefault(_integerField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moduleProperties = {
    moduleName: 'incuna-surveys.proportion-field-directive'
};

var _module = _libraries.angular.module(moduleProperties.moduleName, [_proportionField2.default.moduleName, _integerField2.default.moduleName]);

_module.directive('proportionField', [_proportionField2.default.componentName, function (ProportionField) {
    return {
        restrict: 'A',
        scope: {
            form: '=',
            model: '=',
            options: '=proportionField'
        },
        templateUrl: 'templates/incuna-surveys/form/proportion-field.html',
        link: function link(scope) {
            var baseSliderOptions = {
                maxLimit: 100,
                floor: 0,
                ceil: 100,
                showSelectionBar: true,
                hideLimitLabels: true
            };
            scope.optionsPerSlider = [];
            scope.fields = [];
            scope.total = 0;
            var deregisterOptionsWatcher = scope.$watch('options', function (options) {
                if (!options) {
                    return;
                }
                if (options.fieldOptions) {
                    scope.title = options.fieldOptions.label;
                }
                if (options.choices) {
                    scope.fields = ProportionField.buildFields(options.choices, options.fieldOptions, options.autoId);
                }

                scope.fields.forEach(function () {
                    scope.optionsPerSlider.push(Object.assign({}, baseSliderOptions));
                });

                deregisterOptionsWatcher();
            });

            scope.$watch('options.fieldOptions.errors', function (errors) {
                ProportionField.addErrors(scope.fields, errors || {});
            });

            scope.$watch('model', function (newModel, oldModel) {
                if (!newModel || !oldModel) {
                    scope.model = {};
                    return;
                }

                if (Object.values(newModel).every(function (x) {
                    return x === null;
                })) {
                    return;
                }

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Object.entries(newModel)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _step$value = _slicedToArray(_step.value, 2),
                            k = _step$value[0],
                            v = _step$value[1];

                        if (v === null) {
                            newModel[k] = 0;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                var newSum = ProportionField.calculateTotal(newModel);
                scope.total = newSum;

                if (newSum > 100) {
                    scope.total = 100;
                    var changedIndex = ProportionField.getChangedFieldIndex(newModel, oldModel);
                    scope.model[changedIndex] -= newSum - 100;
                }

                scope.fields.forEach(function (val, i) {
                    scope.optionsPerSlider[i].maxLimit = 100 - newSum + scope.model[i];
                });
            }, true);
        }
    };
}]);

exports.default = moduleProperties;

},{"./../libraries.js":7,"./../services/proportion-field.js":14,"./integer-field.js":3}],5:[function(require,module,exports){
angular.module('incuna-surveys-fields.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/incuna-surveys/fields/base/checkbox.html',
    "<div drf-form-field=to.fieldOptions class=checkbox><div ng-repeat=\"choice in to.choices\" class=\"checkable checkbox\"><input class=checkbox-input id=\"{{ to.autoId }}-{{ $index }}\" type=checkbox checklist-model=model[to.fieldSetId][options.key] checklist-value=$index><label class=checkbox-label for=\"{{ to.autoId }}-{{ $index }}\" ng-bind=choice></label></div></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/base/free-text.html',
    "<div drf-form-field=to.fieldOptions class=\"text {{ model[to.fieldSetId][options.key] ? 'not-empty' : '' }}\" field-id=to.autoId><input type=text class=text-input id=\"{{ to.autoId }}\" ng-model=model[to.fieldSetId][options.key] ng-required=to.fieldOptions.required></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/base/number.html',
    "<div drf-form-field=to.fieldOptions class=\"number {{ model[to.fieldSetId][options.key] ? 'not-empty' : '' }}\" field-id=to.autoId><span integer-field model=model[to.fieldSetId][options.key] id=to.autoId form=form></span></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/base/percentage.html',
    "<div drf-form-field=to.fieldOptions class=slider><div aif-slider-input model=model[to.fieldSetId][options.key] ceiling=100 slider-low-label=0% slider-high-label=100%></div></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/base/proportion.html',
    "<div class=proportion proportion-field=to form=form model=model[to.fieldSetId][options.key]></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/base/radio.html',
    "<div drf-form-field=to.fieldOptions class=radio><div ng-repeat=\"choice in to.choices\" class=\"checkable radio\"><input class=radio-input type=radio id=\"{{ to.autoId }}-{{ $index }}\" ng-value=$index ng-model=model[to.fieldSetId][options.key] ng-required=to.fieldOptions.required><label class=radio-label for=\"{{ to.autoId }}-{{ $index }}\" ng-bind=choice></label></div></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/base/wrapper.html',
    "<section class=\"form-section form-section-{{options.templateOptions.id}}\"><header class=form-section-header><h3 ng-bind=options.templateOptions.name class=form-section-name></h3><h4 ng-bind=options.templateOptions.description class=form-section-desc></h4></header><fieldset class=\"form-section-body content\"><formly-transclude></formly-transclude></fieldset></section>"
  );


  $templateCache.put('templates/incuna-surveys/fields/checkbox.html',
    "<div drf-form-field=to.fieldOptions class=checkbox><div ng-repeat=\"choice in to.choices\" class=\"checkable checkbox\"><input class=checkbox-input id=\"{{ to.autoId }}-{{ $index }}\" type=checkbox checklist-model=model[to.fieldSetId][options.key] checklist-value=$index><label class=checkbox-label for=\"{{ to.autoId }}-{{ $index }}\" ng-bind=choice></label></div></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/free-text.html',
    "<div drf-form-field=to.fieldOptions class=\"text {{ model[to.fieldSetId][options.key] ? 'not-empty' : '' }}\" field-id=to.autoId><input type=text class=text-input id=\"{{ to.autoId }}\" ng-model=model[to.fieldSetId][options.key] ng-required=to.fieldOptions.required></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/number.html',
    "<div drf-form-field=to.fieldOptions class=\"number {{ model[to.fieldSetId][options.key] ? 'not-empty' : '' }}\" field-id=to.autoId><span integer-field model=model[to.fieldSetId][options.key] id=to.autoId form=form></span></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/percentage.html',
    "<div drf-form-field=to.fieldOptions class=slider><div aif-slider-input model=model[to.fieldSetId][options.key] ceiling=100 slider-low-label=0% slider-high-label=100%></div></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/proportion.html',
    "<div class=proportion proportion-field=to form=form model=model[to.fieldSetId][options.key]></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/radio.html',
    "<div drf-form-field=to.fieldOptions class=radio><div ng-repeat=\"choice in to.choices\" class=\"checkable radio\"><input class=radio-input type=radio id=\"{{ to.autoId }}-{{ $index }}\" ng-value=$index ng-model=model[to.fieldSetId][options.key] ng-required=to.fieldOptions.required><label class=radio-label for=\"{{ to.autoId }}-{{ $index }}\" ng-bind=choice></label></div></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/wrapper.html',
    "<section class=\"form-section form-section-{{options.templateOptions.id}}\"><header class=form-section-header><h3 ng-bind=options.templateOptions.name class=form-section-name></h3><h4 ng-bind=options.templateOptions.description class=form-section-desc></h4></header><fieldset class=\"form-section-body content\"><formly-transclude></formly-transclude></fieldset></section>"
  );

}]);

},{}],6:[function(require,module,exports){
angular.module('incuna-surveys-form.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/incuna-surveys/form/base/calculate-percentage.html',
    "<div class=percentage-complete-area><p class=percentage ng-bind=percentageComplete></p><span class=complete translate>complete</span></div>"
  );


  $templateCache.put('templates/incuna-surveys/form/base/integer-field.html',
    "<input class=integer-input id=\"{{ id }}\" name=\"{{ id }}\" type=text ng-model=model ensure-integer><div class=\"error-block field-error\" ng-show=form[id].$invalid><p class=error><span translate>A valid integer is required.</span></p></div>"
  );


  $templateCache.put('templates/incuna-surveys/form/base/proportion-field.html',
    "<span class=title ng-bind=title></span><div class=fields-wrapper><div class=proportion-field ng-repeat=\"field in fields\"><div drf-form-field=field class=\"proportion-field-inner {{ form[id].$invalid ? 'has-error' : '' }}\"><div class=proportion-input integer-field model=model[$index] id=field.id form=form></div><div class=proportion-slider><div clearable-rz-slider model=model[$index] rz-slider-options=optionsPerSlider[$index] slider-low-label=0% slider-high-label=100% ceiling=100></div><span class=allocated-bar style=\"width: {{ total - model[$index] }}%\"></span></div></div></div></div>"
  );


  $templateCache.put('templates/incuna-surveys/form/base/survey-form.html',
    "<form class=question-form ng-submit=submit()><div calculate-percentage question-set=fields model=model></div><header class=form-header><h1 ng-bind=form.name class=form-name></h1><h2 ng-bind=form.description class=form-desc></h2></header><formly-form class=form-body model=model fields=fields></formly-form><button ng-show=form class=button-submit type=submit translate>Submit</button></form>"
  );


  $templateCache.put('templates/incuna-surveys/form/calculate-percentage.html',
    "<div class=percentage-complete-area><p class=percentage ng-bind=percentageComplete></p><span class=complete translate>complete</span></div>"
  );


  $templateCache.put('templates/incuna-surveys/form/integer-field.html',
    "<input class=integer-input id=\"{{ id }}\" name=\"{{ id }}\" type=text ng-model=model ensure-integer><div class=\"error-block field-error\" ng-show=form[id].$invalid><p class=error><span translate>A valid integer is required.</span></p></div>"
  );


  $templateCache.put('templates/incuna-surveys/form/proportion-field.html',
    "<span class=title ng-bind=title></span><div class=fields-wrapper><div class=proportion-field ng-repeat=\"field in fields\"><div drf-form-field=field class=\"proportion-field-inner {{ form[id].$invalid ? 'has-error' : '' }}\"><div class=proportion-input integer-field model=model[$index] id=field.id form=form></div><div class=proportion-slider><div clearable-rz-slider model=model[$index] rz-slider-options=optionsPerSlider[$index] slider-low-label=0% slider-high-label=100% ceiling=100></div><span class=allocated-bar style=\"width: {{ total - model[$index] }}%\"></span></div></div></div></div>"
  );


  $templateCache.put('templates/incuna-surveys/form/survey-form.html',
    "<form class=question-form ng-submit=submit()><div calculate-percentage question-set=fields model=model></div><header class=form-header><h1 ng-bind=form.name class=form-name></h1><h2 ng-bind=form.description class=form-desc></h2></header><formly-form class=form-body model=model fields=fields></formly-form><button ng-show=form class=button-submit type=submit translate>Submit</button></form>"
  );

}]);

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var angular = exports.angular = window.angular;

},{}],8:[function(require,module,exports){
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

var _proportionField = require('./directives/proportion-field.js');

var _proportionField2 = _interopRequireDefault(_proportionField);

var _integerField = require('./directives/integer-field.js');

var _integerField2 = _interopRequireDefault(_integerField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_libraries.angular.module('incuna-surveys', ['drf-form-field', 'aif-slider-input', 'checklist-model', _fieldsConfig2.default.moduleName, _api2.default.moduleName, _form2.default.moduleName, _calculatePercentage2.default.moduleName, _proportionField2.default.moduleName, _integerField2.default.moduleName]);

},{"./directives/calculate-percentage.js":1,"./directives/form.js":2,"./directives/integer-field.js":3,"./directives/proportion-field.js":4,"./libraries.js":7,"./services/api.js":10,"./services/fields-config.js":12}],9:[function(require,module,exports){
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

},{"./../libraries.js":7}],10:[function(require,module,exports){
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

},{"./../libraries.js":7,"./../providers/project-config.js":9}],11:[function(require,module,exports){
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

    this.getImportantQuestionKeys = function (form) {
        var qKeys = [];
        _libraries.angular.forEach(form, function (question) {
            _libraries.angular.forEach(question.fieldGroup, function (field) {
                if (field.templateOptions.fieldOptions.important === true) {
                    qKeys.push(field.key);
                }
            });
        });

        return qKeys;
    };

    // answers is an object containing objects
    // object {
    //     1 : {
    //         2 : 0
    //         3 : 0
    //     }
    // }
    // answered is a number of type number
    this.countNumberOfAnsweredQuestions = function (answers, qKeys) {
        var answered = 0;

        if (qKeys.length === 0) {
            return answered;
        }

        for (var groupKey in answers) {
            var answerGroup = answers[groupKey];
            for (var answerKey in answerGroup) {
                var answer = answerGroup[answerKey];
                if (qKeys.indexOf(parseInt(answerKey)) !== -1) {
                    if (answer && answer !== null || answer === 0) {
                        answered++;
                    }
                }
            }
        }

        return answered;
    };

    this.calculatePercentageComplete = function (completedQuestions, totalQuestionCount) {
        var zero = 0 + '%';

        if (totalQuestionCount === 0) {
            return zero;
        }

        var result = completedQuestions / totalQuestionCount * 100;
        if (result >= 0) {
            return Math.round(result) + '%';
        }

        return zero;
    };
}]);

exports.default = moduleProperties;

},{"./../libraries.js":7}],12:[function(require,module,exports){
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

    formlyConfig.setType({
        name: 'proportion',
        templateUrl: templatesBase + '/proportion.html'
    });

    formlyConfig.setWrapper([{
        name: 'panel',
        templateUrl: templatesBase + '/wrapper.html'
    }]);
}]);

exports.default = moduleProperties;

},{"./../libraries.js":7}],13:[function(require,module,exports){
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
                                important: field.important,
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

    this.addFieldErrors = function (fields, errors) {
        if (fields && errors) {
            fields.forEach(function (fieldset) {
                var key = fieldset.templateOptions.id;
                var fieldsetErrors = errors[key];
                fieldset.fieldGroup.forEach(function (field) {
                    var fieldError = fieldsetErrors && fieldsetErrors[field.key];
                    field.templateOptions.fieldOptions.errors = fieldError;
                });
            });
        }
    };
}]);

exports.default = moduleProperties;

},{"./../libraries.js":7}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moduleProperties = undefined;

var _libraries = require('./../libraries.js');

var moduleProperties = exports.moduleProperties = {
    moduleName: 'incuna-surveys.proportion-field',
    componentName: 'proportionField'
}; /*
    *
    * This module calculates the survey completion percentage/
    *
    */

var _module = _libraries.angular.module(moduleProperties.moduleName, []);

_module.service(moduleProperties.componentName, [function () {

    this.buildFields = function (choices, defaults, autoId) {
        return choices.map(function (choice, index) {
            return Object.assign({}, defaults, {
                label: choice,
                id: autoId + '-' + index
            });
        });
    };

    this.calculateTotal = function (values) {
        if (!values) {
            return 0;
        }
        return Object.keys(values).reduce(function (total, key) {
            var value = parseInt(values[key], 10) || 0;
            return total + value;
        }, 0);
    };

    this.addErrors = function (fields, errors) {
        fields.forEach(function (options, index) {
            options.errors = errors[index];
        });
    };

    this.getChangedFieldIndex = function (newModel, oldModel) {
        var newValues = Object.values(newModel);
        var oldValues = Object.values(oldModel);

        return newValues.findIndex(function (el, i) {
            return el !== oldValues[i];
        });
    };
}]);

exports.default = moduleProperties;

},{"./../libraries.js":7}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
