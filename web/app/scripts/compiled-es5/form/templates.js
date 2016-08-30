angular.module('incuna-surveys-form.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/incuna-surveys/form/survey-form.html',
    "<form ng-submit=submit()><formly-form model=model fields=fields></formly-form><button type=submit>Submit</button></form>"
  );

}]);
