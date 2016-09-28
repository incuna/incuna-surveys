describe('integer-field directive', function () {
    beforeEach(function () {
        angular.mock.module('incuna-surveys-form.templates');
        angular.mock.module('incuna-surveys.integer-field-directive');
        inject(function ($rootScope, $compile) {
            this.$rootScope = $rootScope;
            this.$compile = $compile;
        });

        this.tpl = '<input type="text" ensure-integer ng-model="model">';
        this.scope = this.$rootScope.$new();
        this.elm = this.$compile(this.tpl)(this.scope);
        this.ngModel = this.elm.controller('ngModel');
    });

    it('should set the model value if the value is an integer', function () {
        this.ngModel.$setViewValue(6);
        this.scope.$apply();
        expect(this.scope.model).toBe(6);
    });

    it('should be valid and set the model if the value is an integer string', function () {
        this.ngModel.$setViewValue('6');
        this.scope.$apply();
        expect(this.ngModel.$valid).toBe(true);
        expect(this.scope.model).toBe(6);
    });

    it('should  valid and set the model to an integer if the value is set to a float', function () {
        this.ngModel.$setViewValue('1.4');
        this.scope.$apply();
        expect(this.ngModel.$valid).toBe(true);
        expect(this.scope.model).toBe(1);
    });

    it('should be valid if the value is not provided', function () {
        this.ngModel.$setViewValue();
        this.scope.$apply();
        expect(this.ngModel.$valid).toBe(true);
    });

    it('should be valid and value is null', function () {
        this.ngModel.$setViewValue(null);
        this.scope.$apply();
        expect(this.ngModel.$valid).toBe(true);
    });

    it('should be valid and value is null', function () {
        this.ngModel.$setViewValue(undefined);
        this.scope.$apply();
        expect(this.ngModel.$valid).toBe(true);
    });

    it('should not be valid and shold set the model value to undefined if the value is not a valid integer', function () {
        this.ngModel.$setViewValue('Five');
        this.scope.$apply();
        expect(this.ngModel.$valid).toBe(false);
        expect(this.scope.model).toBe(undefined);
    });
});
