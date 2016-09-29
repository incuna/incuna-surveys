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
