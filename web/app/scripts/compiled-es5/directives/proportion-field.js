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
