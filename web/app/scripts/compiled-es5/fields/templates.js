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
    "<div drf-form-field=to.fieldOptions class=radio><div ng-repeat=\"choice in to.choices\" class=\"checkable radio\">{% raw %} <input class=radio-input type=radio id=\"{{ to.autoId }}-{{ $index }}\" ng-value=$index ng-model=model[to.fieldSetId][options.key] ng-required=to.fieldOptions.required><label class=radio-label for=\"{{ to.autoId }}-{{ $index }}\" ng-bind=choice></label>{% endraw %}</div></div>"
  );


  $templateCache.put('templates/incuna-surveys/fields/wrapper.html',
    "{% raw %}<section class=\"form-section form-section-{{options.templateOptions.id}}\"><header class=form-section-header><h3 ng-bind=options.templateOptions.name class=form-section-name></h3><h4 ng-bind=options.templateOptions.description class=form-section-desc></h4></header><fieldset class=\"form-section-body content\"><formly-transclude></formly-transclude></fieldset></section>{% endraw %}"
  );

}]);
