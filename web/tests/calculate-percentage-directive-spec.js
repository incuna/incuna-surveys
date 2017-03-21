describe('calculatePercentage directive', function () {
    const questionSet = {
        1: {
            fieldGroup: [
                1,
                2,
                3
            ]
        },
        2: {
            fieldGroup: [
                1,
                2,
                3
            ]
        }
    };
    const answers = {
        1: {
            2: 9,
            3: 0
        },
        2: {
            4: 3,
            5: 6
        }
    }

    beforeEach(function () {
        angular.mock.module('incuna-surveys-form.templates');
        angular.mock.module('incuna-surveys.calculate-percentage-directive');

        inject(function (_$rootScope_, _$compile_, _$q_, _calculateCompletionPercent_) {
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
        spyOn(this.calculateCompletionPercent, 'countQuestionsTotal').and.callThrough();
        spyOn(this.calculateCompletionPercent, 'countNumberOfAnsweredQuestions').and.callThrough();
    });

    it('should call this.calculateCompletionPercent.countQuestionsTotal with the questionSet', function () {
        this.scope.fields = questionSet;
        this.compileDirective(this.tpl);
        expect(this.calculateCompletionPercent.countQuestionsTotal).toHaveBeenCalledWith(questionSet)
    });

    it('should return the total number of questions', function () {
        const questionCount = this.calculateCompletionPercent.countQuestionsTotal(questionSet);
        expect(questionCount).toEqual(6);
    });

    it('should call this.calculateCompletionPercent.countNumberOfAnsweredQuestions with the answer set', function () {
        this.scope.fields = questionSet;
        this.scope.getResponse = answers;
        this.compileDirective(this.tpl);
        expect(this.calculateCompletionPercent.countNumberOfAnsweredQuestions).toHaveBeenCalledWith(this.scope.getResponse)
    });

    it('should return the percentage complete', function () {
        const questionCount = this.calculateCompletionPercent.countQuestionsTotal(questionSet);
        const answersCount = this.calculateCompletionPercent.countNumberOfAnsweredQuestions(answers);
        const percentage = this.calculateCompletionPercent.calculatePercentageComplete(answersCount, questionCount);
        expect(percentage).toEqual('67%');
    });
});
