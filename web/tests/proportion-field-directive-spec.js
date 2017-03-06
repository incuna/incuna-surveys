describe('proportion-field directive', function () {
    beforeEach(function () {

        angular.mock.module('incuna-surveys-form.templates');
        angular.mock.module('incuna-surveys.proportion-field-directive');
        inject(function ($rootScope, $compile, proportionField) {
            this.$rootScope = $rootScope;
            this.$compile = $compile;
            this.proportionField = proportionField;
        });

        this.options = {
            fieldOptions: {
                label: 'Field Title'
            },
            autoId: '1',
            choices: ['One', 'Two']
        };
        this.model = {
            0: 10,
            3: 30
        };
        this.errors = {
            2: ['A valid integer is required.']
        };
        this.tpl = '<div proportion-field="options" model="model"></div>';
        this.scope = this.$rootScope.$new();
        this.scope.model = {};
        this.scope.options = {};
        this.compileDirective = function () {
            this.elm = this.$compile(this.tpl)(this.scope);
            this.scope.$digest();
        };
    });

    describe('initialisation', function () {
        beforeEach(function () {
            this.compileDirective();
        });

        it('should render a h4', function () {
            expect(this.elm.find('h4').length).toEqual(1);
        });

        it('should include empty fields in the scope', function () {
            const isolated = this.elm.isolateScope()
            expect(isolated.fields).toEqual([]);
        });
    });

    describe('setting options', function () {
        beforeEach(function () {
            spyOn(this.proportionField, 'buildFields').and.callThrough();
            this.scope.options = this.options;
            this.compileDirective();
            this.isolated = this.elm.isolateScope()
        });

        it('should add title to the scope based on the options.fieldOptions.label', function () {
            expect(this.isolated.title).toEqual('Field Title');
        });

        it('should call buildFields', function () {
            expect(this.proportionField.buildFields).toHaveBeenCalledWith(
                this.isolated.options.choices,
                this.isolated.options.fieldOptions,
                this.isolated.options.autoId
            )
        });

        describe('should call addErrors', function () {
            it('with erros', function () {
                spyOn(this.proportionField, 'addErrors');
                this.scope.options.fieldOptions.errors = this.errors;
                this.scope.$digest();
                expect(this.proportionField.addErrors).toHaveBeenCalledWith(
                    this.isolated.fields,
                    this.errors
                )
            });

            it('to clear errors', function () {
                this.scope.options.fieldOptions.errors = this.errors;
                this.scope.$digest();
                spyOn(this.proportionField, 'addErrors');
                this.scope.options.fieldOptions.errors = undefined;
                this.scope.$digest();
                expect(this.proportionField.addErrors).toHaveBeenCalledWith(
                    this.isolated.fields,
                    {}
                )
            });
        });

    });

    describe('setting model', function () {
        beforeEach(function () {
            this.total = 100;
            this.scope.options = this.options;
            this.scope.model = this.model;
            this.compileDirective();
            this.isolated = this.elm.isolateScope()
            this.scope.$digest();
        });

        it('should create an empty opbject if the model is null', function () {
            this.scope.model = null;
            this.scope.$digest();
            expect(this.isolated.model).toEqual({});
        });

        it('should not allow a field to have a value which will make the sum greater than 100', function () {
            this.scope.model = {
                0: 5,
                1: 20,
                2: 0
            };
            this.scope.$digest();
            this.scope.model = {
                0: 5,
                1: 20,
                2: 100
            };
            this.scope.$digest();
            expect(this.scope.model[2]).toBe(75);
        });

    });
});
