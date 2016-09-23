angular.module('incuna-surveys-form.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/incuna-surveys/form/calculate-percentage.html',
    "<div class=percentage-complete-area><p class=percentage ng-bind=percentageComplete></p><span class=complete translate>complete</span></div>"
  );


  $templateCache.put('templates/incuna-surveys/form/proportion-field.html',
    "<div class=proportion><h4 ng-bind=title></h4><div class=bar style=\"width: 600px\"><span ng-repeat=\"field in fields\" style=\"width:{{ field.percentage }}%; display: inline-block; background-color: #{{field.hex}}; height:30px\"></span></div>Total: <span class=total ng-bind=total></span><div ng-repeat=\"field in fields\"><div drf-form-field=field class=proportion><input class=proportion-input id=\" {{ field.id }}\" type=text ng-model=model[$index]> <span class=percentage ng-bind=field.percentage|number:0></span>%</div></div></div>"
  );


  $templateCache.put('templates/incuna-surveys/form/survey-form.html',
    "<form class=question-form ng-submit=submit()><div calculate-percentage question-set=fields model=model></div><header class=form-header><h1 ng-bind=form.name class=form-name></h1><h2 ng-bind=form.description class=form-desc></h2></header><formly-form class=form-body model=model fields=fields></formly-form><button class=button-submit type=submit>Submit</button></form>"
  );

}]);
