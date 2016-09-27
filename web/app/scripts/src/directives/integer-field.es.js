import { angular } from '../libraries';

const moduleProperties = {
    moduleName: 'incuna-surveys.integer-field-directive'
};

const module = angular.module(moduleProperties.moduleName, []);

module.directive('ensureInteger', [
    function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attr, ctrl) {
                ctrl.$parsers.push((val) => {
                    if (!val) {
                        return null;
                    }
                    const value = parseInt(val, 10);
                    if (Number.isNaN(value)) {
                        return undefined;
                    }
                    return value;
                });
            }
        };
    }
]);

module.directive('integerField', [
    function () {
        return {
            templateUrl: 'templates/incuna-surveys/form/integer-field.html',
            scope: {
                form: '=',
                model: '=',
                id: '='
            }
        };
    }

]);

export default moduleProperties;
