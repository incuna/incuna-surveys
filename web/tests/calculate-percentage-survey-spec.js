describe('FieldsetParserService', function () {
    const questionSet = {
        1 : {
            fieldGroup : [
                1,
                2,
                3
            ]
        },
        2 : {
            fieldGroup : [
                1,
                2,
                3
            ]
        }
    };
    const answerSet = {
        1: {
            2: 9,
            3: 0
        },
        2: {
            4: 0,
            5: 6,
        }
    }

    beforeEach(function () {
        angular.mock.module('incuna-surveys.calculate-completion-percent');

        inject(function (calculateCompletionPercent) {
            this.Parser = calculateCompletionPercent;
        });

        this.totalQuestions = this.Parser.countQuestionsTotal(questionSet);
        this.totalQuestionsAnswered = this.Parser.countNumberOfAnsweredQuestions(answerSet);
    });

    describe('countQuestionsTotal function', function () {
        it('should return the total number of questions', function () {
            expect(this.totalQuestions).toBe(6);
        });
    });

    describe('countNumberOfAnsweredQuestions function', function () {
        it('should return the total number of questions answered', function () {
            expect(this.totalQuestionsAnswered).toBe(2);
        });
    });

    describe('calculatePercentageComplete function', function () {
        it('should return the 0 percentage when none answered', function () {
            this.percentage = this.Parser.calculatePercentageComplete(0, this.totalQuestions);
            expect(this.percentage).toBe(0 + '%');
        });

        it('should return the percentage', function () {
            this.percentage = this.Parser.calculatePercentageComplete(this.totalQuestionsAnswered, this.totalQuestions);
            expect(this.percentage).toBe(33 + '%');
        });

        it('should return the 100 percentage when all answered', function () {
            this.percentage = this.Parser.calculatePercentageComplete(6, this.totalQuestions);
            expect(this.percentage).toBe(100 + '%');
        });
    });
});
