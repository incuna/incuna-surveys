describe('test', function () {

    beforeEach(function () {
        fixture.setBase('tests/api-description');
    });
    

    // TODO: remove this test. This is only a proof of concept.
    it('should run', function () {
        const myObj = require('compiled-es5/test').myObj;
        expect(myObj.one).toBe(1);
    });

    it('should load the api description', function () {
        const testFixture = fixture.load('dummy.json');
        expect(testFixture.OK).toBe('OK');
    });
    

});
