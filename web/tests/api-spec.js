describe('api service', function () {

    beforeEach(function () {
        fixture.setBase('tests/api-description');

        angular.mock.module('incuna-surveys.api');

        inject(function ($httpBackend, $rootScope, API) {
            this.$httpBackend = $httpBackend;
            this.$rootScope = $rootScope;
            this.api = API;
        });

        this.$httpBackend.when('GET', 'localhost:8000/forms')
            .respond(fixture.load('forms/get.json').OK.response_data);

        this.$httpBackend.when('GET', 'http://localhost:8000/forms/1')
            .respond(fixture.load('forms/pk/get.json').OK.response_data);
        
    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingExpectation();
        this.$httpBackend.verifyNoOutstandingRequest();
    });

    describe('getList method', function () {
        
        it('should return a promise with the data of available forms', function () {
            this.api.getList().then((data) => {
                expect(data[0].name).toBe('How have you been using the site?');
                expect(data[0].url).toBe('http://localhost:8000/forms/1');
            });
            
            this.$rootScope.$digest();
            this.$httpBackend.flush();
        });
        
    });

    describe('getForm', function () {

        it('should return a promise with the data of a form', function () {
            const url = 'http://localhost:8000/forms/1';

            this.api.getForm(url).then((data) => {
                expect(data.name).toBe('How have you been using the site?');
                expect(data.fieldsets[0].name).toBe('Free text field');
            });

            this.$rootScope.$digest();
            this.$httpBackend.flush();
        });
        
    });
    
});
