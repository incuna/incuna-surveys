describe('calculatePercentage directive', function() {
    const fields = {thing: 'Thing'}; 
    const getResponse = {any: 'Any'};

    beforeEach(function () {

        angular.mock.module('incuna-surveys-form.templates');
        angular.mock.module('incuna-surveys.calculate-percentage-directive');

        inject(function(_$rootScope_, _$compile_, _$q_, _calculateCompletionPercent_) {
            const $rootScope = _$rootScope_;
            this.$compile = _$compile_;
            this.$q = _$q_;
            this.calculateCompletionPercent = _calculateCompletionPercent_;
            this.scope = $rootScope.$new();
        })
        this.tpl = '<div calculate-percentage question-set="fields" model="getResponse"></div>';
        this.compileDirective = function (tpl) {
            this.elm = this.$compile(tpl)(this.scope);
            this.scope.$digest();
        };
    });

    it('should call this.calculateCompletionPercent.countQuestionsTotal with the fields', function() {
        expect(this.calculateCompletionPercent.countQuestionsTotal).toHaveBeenCalledWith(fields);
    });


});
