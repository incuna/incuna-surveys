angular.module('incuna-surveys-form.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/incuna-surveys/form/survey-form.html',
    "<form ng-submit=submit()><h1 ng-bind=form.name class=form-name></h1><h2 ng-bind=form.description class=form-desc></h2><formly-form model=model fields=fields></formly-form><button type=submit>Submit</button></form>"
  );

}]);
