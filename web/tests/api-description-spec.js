describe('api-description', function () {

    beforeEach(function () {
        fixture.setBase('tests/api-description');
    });
    
    it('should load', function () {
        const testFixture = fixture.load('dummy.json');
        expect(testFixture.OK).toBe('OK');
    });
    

});
