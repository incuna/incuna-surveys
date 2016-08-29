describe('surveysForm directive', function() {
    const getResponse = {any: 'Any'};
    const postData = {other: 'Other'};
    const fields = {thing: 'Thig'}; 

    let scope;
    let elm;
    let formResponse;

    let formUrl = 'http://from-url';
    let responseUrl = 'http://response-url';

    let $rootScope;
    let $compile;
    let $q;
    let compileDirective;
    let API;
    let FieldsParser;

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
            $rootScope = _$rootScope_;
            $compile = _$compile_;
            $q = _$q_;
            API = _API_;
            FieldsParser = _FieldsParser_;
            scope = $rootScope.$new();
            scope.formUrl = formUrl;
            scope.responseUrl = responseUrl;
        })
        compileDirective = function () {
            const tpl = '<div surveys-form form-url="formUrl" response-url="responseUrl"></div>';
            elm = $compile(tpl)(scope);
            scope.$digest();
        }

        const formDefer = $q.defer();
        formResponse = fixture.load('forms/pk/get.json').OK.response_data;
        formDefer.resolve(formResponse);
        spyOn(API, 'getForm').and.returnValue(formDefer.promise);

        const responseDefer = $q.defer();
        responseDefer.resolve(getResponse);
        spyOn(API, 'get').and.returnValue(responseDefer.promise);

      
        spyOn(FieldsParser, 'parseFields').and.returnValue(fields);
    });


    describe('initialisation', function() {
        beforeEach(function() {
            compileDirective();
        });
        it('should produce 1 form and a button', function() {
            expect(elm.find('form').length).toEqual(1);
            expect(elm.find('button').length).toEqual(1);
        });
        it('should include the formUrl and responseUrl i nthe scope', function() {
            const isolated = elm.isolateScope()
            expect(isolated.formUrl).toBe(formUrl);
            expect(isolated.responseUrl).toBe(responseUrl);
        });
        it('should call API.getForm with the formUrl', function() {
            expect(API.getForm).toHaveBeenCalledWith(formUrl);
        });
        it('should call API.get with the responseUrl', function() {
            expect(API.get).toHaveBeenCalledWith(responseUrl);
        });
        it('should add the API.get response to scope.model', function() {
            const isolated = elm.isolateScope()
            expect(isolated.model).toBe(getResponse);
        });
        it('should call FieldsetParser.parseFields with API.getForm response', function() {
            expect(FieldsParser.parseFields).toHaveBeenCalledWith(formResponse);
        });
        it('should add the FieldsetParser.parseFields response to scope.fields', function() {
            const isolated = elm.isolateScope()
            expect(isolated.fields).toBe(fields);
        });
    });

    describe('submit', function() {
        beforeEach(function() {
            compileDirective();
            spyOn(FieldsParser, 'parseModelToResponce').and.returnValue(postData);
            spyOn(API, 'post');

            elm.isolateScope().submit();
        });
        it('should call FieldsetParser.parseModelToResponce with the scope.model', function() {
            expect(FieldsParser.parseModelToResponce).toHaveBeenCalledWith(getResponse);
        });
        it('should API.post with the responseUrl and the post data', function() {
            expect(API.post).toHaveBeenCalledWith(responseUrl, postData)
        });
    });
    
});
