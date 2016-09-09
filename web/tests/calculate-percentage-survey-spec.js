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
        this.percentage = this.Parser.calculatePercentageComplete(this.totalQuestionsAnswered, this.totalQuestions);
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
        it('should return the percentage', function () {
            expect(this.percentage).toBe(33 + '%');
        });
    });
});
