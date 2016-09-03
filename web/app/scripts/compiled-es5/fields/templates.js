angular.module('incuna-surveys-fields.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/incuna-surveys/fields/checkbox.html',
    "<div drf-form-field=to.fieldOptions field-id=options.key class=checkbox><div ng-repeat=\"choice in to.choices\" class=\"checkable checkbox\">{% raw %} <input class=checkbox-input id=\"{{ to.autoId }}-{{ $index }}\" type=checkbox checklist-model=model[to.fieldSetId][options.key] checklist-value=$index><label class=checkbox-label for=\"{{ to.autoId }}-{{ $index }}\" ng-bind=choice></label>{% endraw %}</div></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/fieldset-header.html',
    "<h3 ng-bind=to.fieldGroupName></h3><h4 ng-bind=to.fieldGroupDesc></h4>"
  );


  $templateCache.put('templates/incuna-surveys/fields/free-text.html',
    "<div drf-form-field=to.fieldOptions class=text field-id=options.key><input type=text class=text-input id=\"{% raw %}{{ to.autoId }}{% endraw %}\" ng-model=model[to.fieldSetId][options.key] ng-required=to.fieldOptions.required></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/header.html',
    "<h1 ng-bind=to.formName></h1><h2 ng-bind=to.formDescription></h2>"
  );


  $templateCache.put('templates/incuna-surveys/fields/number.html',
    "<div drf-form-field=to.fieldOptions class=number field-id=options.key><input type=text class=number-input id=\"{% raw %}{{ to.autoId }}{% endraw %}\" ng-model=model[to.fieldSetId][options.key]></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/percentage.html',
    "<div drf-form-field=to.fieldOptions field-id=options.key class=slider><div aif-slider-input model=model[to.fieldSetId][options.key] ceiling=100 slider-low-label=0% slider-high-label=100%></div></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/radio.html',
    "<div drf-form field=to.fieldOptions class=radio><div ng-repeat=\"choice in to.choices\" class=\"checkable radio\">{% raw %} <input type=radio id=\"{{ to.autoId }}-{{ $index }}\" ng-value=$index ng-model=model[to.fieldSetId][options.key] ng-required=to.fieldOptions.required><label for=\"{{ to.autoId }}-{{ $index }}\" ng-bind=choice></label>{% endraw %}</div></div>"
  );

}]);
