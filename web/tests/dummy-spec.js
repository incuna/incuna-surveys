describe('test', function () {

    beforeEach(function () {
        fixture.setBase('tests/api-description');
    });

    it('should load the api description', function () {
        const testFixture = fixture.load('dummy.json');
        expect(testFixture.OK).toBe('OK');
    });

});
