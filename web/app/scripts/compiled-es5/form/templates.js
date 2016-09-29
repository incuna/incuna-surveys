angular.module('incuna-surveys-form.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/incuna-surveys/form/base/calculate-percentage.html',
    "<div class=percentage-complete-area><p class=percentage ng-bind=percentageComplete></p><span class=complete translate>complete</span></div>"
  );


  $templateCache.put('templates/incuna-surveys/form/base/integer-field.html',
    "<input class=integer-input id=\"{{ id }}\" name=\"{{ id }}\" type=text ng-model=model ensure-integer><div class=\"error-block field-error\" ng-show=form[id].$invalid><p class=error><span translate>A valid integer is required.</span></p></div>"
  );


  $templateCache.put('templates/incuna-surveys/form/base/proportion-field.html',
    "<h4 class=title ng-bind=title></h4><span class=total-bar><span class=bar-portion ng-repeat=\"field in fields\" style=\"width: {{ field.percentage }}%\"></span> </span><span class=total>Total: <span class=total-figure ng-bind=total></span></span><div class=fields-wrapper><div class=proportion-field ng-repeat=\"field in fields\"><div drf-form-field=field class=proportion-field-inner><div class=proportion-input integer-field model=model[$index] id=field.id form=form></div><span class=percentage ng-class=\"{ filled: field.percentage > 0 }\"><span class=number ng-bind=field.percentage|number:0></span>%</span></div></div></div>"
  );


  $templateCache.put('templates/incuna-surveys/form/base/survey-form.html',
    "<form class=question-form ng-submit=submit()><div calculate-percentage question-set=fields model=model></div><header class=form-header><h1 ng-bind=form.name class=form-name></h1><h2 ng-bind=form.description class=form-desc></h2></header><formly-form class=form-body model=model fields=fields></formly-form><button class=button-submit type=submit>Submit</button></form>"
  );


  $templateCache.put('templates/incuna-surveys/form/calculate-percentage.html',
    "<div class=percentage-complete-area><p class=percentage ng-bind=percentageComplete></p><span class=complete translate>complete</span></div>"
  );


  $templateCache.put('templates/incuna-surveys/form/integer-field.html',
    "<input class=integer-input id=\"{{ id }}\" name=\"{{ id }}\" type=text ng-model=model ensure-integer><div class=\"error-block field-error\" ng-show=form[id].$invalid><p class=error><span translate>A valid integer is required.</span></p></div>"
  );


  $templateCache.put('templates/incuna-surveys/form/proportion-field.html',
    "<h4 class=title ng-bind=title></h4><span class=total-bar><span class=bar-portion ng-repeat=\"field in fields\" style=\"width: {{ field.percentage }}%\"></span> </span><span class=total>Total: <span class=total-figure ng-bind=total></span></span><div class=fields-wrapper><div class=proportion-field ng-repeat=\"field in fields\"><div drf-form-field=field class=proportion-field-inner><div class=proportion-input integer-field model=model[$index] id=field.id form=form></div><span class=percentage ng-class=\"{ filled: field.percentage > 0 }\"><span class=number ng-bind=field.percentage|number:0></span>%</span></div></div></div>"
  );


  $templateCache.put('templates/incuna-surveys/form/survey-form.html',
    "<form class=question-form ng-submit=submit()><div calculate-percentage question-set=fields model=model></div><header class=form-header><h1 ng-bind=form.name class=form-name></h1><h2 ng-bind=form.description class=form-desc></h2></header><formly-form class=form-body model=model fields=fields></formly-form><button class=button-submit type=submit>Submit</button></form>"
  );

}]);
