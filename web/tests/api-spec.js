describe('api service', function () {

    beforeEach(function () {
        fixture.setBase('tests/api-description');

        angular.mock.module('incuna-surveys.api');

        inject(function ($httpBackend, $rootScope, API) {
            this.$httpBackend = $httpBackend;
            this.$rootScope = $rootScope;
            this.api = API;
        });

        this.post = fixture.load('forms/pk/respond/post.json')
        this.get = fixture.load('forms/pk/respond/user_id/get.json')

        this.$httpBackend.when('GET', 'localhost:8000/forms')
            .respond(fixture.load('forms/get.json').OK.response_data);

        this.$httpBackend.when('GET', 'http://localhost:8000/forms/1')
            .respond(fixture.load('forms/pk/get.json').OK.response_data);

        this.$httpBackend.when('GET', this.get.url)
            .respond(this.get.OK.response_data);
        
        this.$httpBackend.when('POST', this.post.url)
            .respond(this.post.OK.response_data);
        
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

    describe('get', function () {
        it('should return a promise with the data from the api', function () {
            const url = 'http://localhost:8000/forms/1';

            this.api.getForm(this.get.url).then((data) => {
                expect(data).toEqual(this.get.OK.response_data);
            });

            this.$rootScope.$digest();
            this.$httpBackend.flush();
        });
    });

    describe('post', function () {
        it('should return a promise with the data of a new response', function () {
            const data = this.post.fields;

            this.api.post(this.post.url, data).then((data) => {
                expect(data).toEqual(this.post.OK.response_data);
            });

            this.$rootScope.$digest();
            this.$httpBackend.flush();
        });
    });
    
});
