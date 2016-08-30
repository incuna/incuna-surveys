describe('surveysForm directive', function() {
    const getResponse = {any: 'Any'};
    const postData = {other: 'Other'};
    const fields = {thing: 'Thig'}; 
    const formUrl = 'http://from-url';
    const responseUrl = 'http://response-url';

    beforeEach(function () {
        fixture.setBase('tests/api-description');

        angular.module('formly', []);
        angular.mock.module({
            formlyConfig: {
                setType: angular.noop
            }
        });
        angular.mock.module('incuna-surveys.form-directive');

        inject(function(_$rootScope_, _$compile_, _$q_, _API_, _FieldsParser_) {
            const $rootScope = _$rootScope_;
            this.$compile = _$compile_;
            this.$q = _$q_;
            this.API = _API_;
            this.FieldsParser = _FieldsParser_;
            this.scope = $rootScope.$new();
            this.scope.formUrl = formUrl;
            this.scope.responseUrl = responseUrl;
        })
        this.compileDirective = function () {
            const tpl = '<div surveys-form form-url="formUrl" response-url="responseUrl"></div>';
            this.elm = this.$compile(tpl)(this.scope);
            this.scope.$digest();
        };

        const formDefer = this.$q.defer();
        this.formResponse = fixture.load('forms/pk/get.json').OK.response_data;
        formDefer.resolve(this.formResponse);
        spyOn(this.API, 'getForm').and.returnValue(formDefer.promise);

        const responseDefer = this.$q.defer();
        responseDefer.resolve(getResponse);
        spyOn(this.API, 'get').and.returnValue(responseDefer.promise);

      
        spyOn(this.FieldsParser, 'parseFields').and.returnValue(fields);
    });

    describe('initialisation', function() {
        beforeEach(function() {
            this.compileDirective();
        });

        it('should produce 1 form and a button', function() {
            expect(this.elm.find('form').length).toEqual(1);
            expect(this.elm.find('button').length).toEqual(1);
        });

        it('should include the formUrl and responseUrl in the scope', function() {
            const isolated = this.elm.isolateScope()
            expect(isolated.formUrl).toBe(formUrl);
            expect(isolated.responseUrl).toBe(responseUrl);
        });

        it('should call API.getForm with the formUrl', function() {
            expect(this.API.getForm).toHaveBeenCalledWith(formUrl);
        });

        it('should call API.get with the responseUrl', function() {
            expect(this.API.get).toHaveBeenCalledWith(responseUrl);
        });

        it('should add the API.get response to scope.model', function() {
            const isolated = this.elm.isolateScope()
            expect(isolated.model).toBe(getResponse);
        });

        it('should call FieldsetParser.parseFields with API.getForm response', function() {
            expect(this.FieldsParser.parseFields).toHaveBeenCalledWith(this.formResponse);
        });

        it('should add the FieldsetParser.parseFields response to scope.fields', function() {
            const isolated = this.elm.isolateScope()
            expect(isolated.fields).toBe(fields);
        });
    });

    describe('submit', function() {
        beforeEach(function() {
            this.compileDirective();
            spyOn(this.FieldsParser, 'parseModelToResponse').and.returnValue(postData);
            spyOn(this.API, 'post');

            this.elm.isolateScope().submit();
        });
        it('should call FieldsetParser.parseModelToResponse with the scope.model', function() {
            expect(this.FieldsParser.parseModelToResponse).toHaveBeenCalledWith(getResponse);
        });
        it('should API.post with the responseUrl and the post data', function() {
            expect(this.API.post).toHaveBeenCalledWith(responseUrl, postData)
        });
    });
    
});
