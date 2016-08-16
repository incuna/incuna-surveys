describe('api service', function () {

    beforeEach(function () {
        fixture.setBase('tests/api-description');

        inject(function ($http) {
            const mockProjectConfig = {
                getSettings:() => ({
                    apiRoot: 'localhost:8000'
                })
            };

            this.api = require('compiled-es5/services/api').API(
                $http,
                mockProjectConfig
            );
        });

        inject(function ($httpBackend, $rootScope) {
            this.$httpBackend = $httpBackend;
            this.$rootScope = $rootScope;
        });

        this.$httpBackend.when('GET', 'localhost:8000/forms')
            .respond(fixture.load('forms/get.json').OK.response_data);

        this.$httpBackend.when('GET', 'http://localhost:8000/forms/1')
            .respond(fixture.load('forms/pk/get.json').OK.response_data);
        
    });

    describe('getList method', function () {
        
        it('should return a promise with the data of available forms', function (done) {
            this.api.getList().then((data) => {
                expect(data[0].name).toBe('How have you been using the site?');
                expect(data[0].url).toBe('http://localhost:8000/forms/1');
                done();
            });
            
            this.$httpBackend.flush();
            this.$rootScope.$digest();
        });
        
    });

    describe('getForm', function () {

        it('should return a promise with the data of a form', function (done) {
            const url = 'http://localhost:8000/forms/1';
            this.api.getForm(url).then((data) => {

                expect(data.name).toBe('How have you been using the site?');
                expect(data.fieldsets[0].name).toBe('Free text field');
            
                done();
            });
            this.$httpBackend.flush();
            this.$rootScope.$digest();
        });
        
    });
    
});
