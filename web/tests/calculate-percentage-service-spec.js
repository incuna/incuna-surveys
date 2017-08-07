describe('calculateCompletionPercentService', function () {
    const questionSet = {
        1: {
            fieldGroup: [
                {
                    key: 1,
                    templateOptions: {
                        fieldOptions: {
                            important: false
                        }
                    }

                },
                {
                    key: 2,
                    templateOptions: {
                        fieldOptions: {
                            important: true
                        }
                    }

                },
                {
                    key: 3,
                    templateOptions: {
                        fieldOptions: {
                            important: true
                        }
                    }

                }
            ]
        },
        2: {
            fieldGroup: [
                {
                    key: 1,
                    templateOptions: {
                        fieldOptions: {
                            important: false
                        }
                    }

                },
                {
                    key: 2,
                    templateOptions: {
                        fieldOptions: {
                            important: true
                        }
                    }

                },
                {
                    key: 3,
                    templateOptions: {
                        fieldOptions: {
                            important: false
                        }
                    }

                }
            ]
        }
    };
    const answers = {
        1: {
            1: 9,
            2: 0,
            3: 1
        },
        2: {
            1: 3,
            2: null,
            3: 1
        }
    }

    beforeEach(function () {
        angular.mock.module('incuna-surveys.calculate-completion-percent');

        inject(function (calculateCompletionPercent) {
            this.Parser = calculateCompletionPercent;
        });

        this.totalQuestions = this.Parser.countQuestionsTotal(questionSet);
    });

    describe('countQuestionsTotal function', function () {
        it('should return the total number of questions', function () {
            expect(this.totalQuestions).toBe(3);
        });
    });

    describe('countNumberOfAnsweredQuestions function', function () {

        it('should not count null question answers', function () {
            const emptyAnswerSet = {
                1: {
                    2: null
                }
            };
            const noQuestionsAnswered = this.Parser.countNumberOfAnsweredQuestions(emptyAnswerSet);
            expect(noQuestionsAnswered).toBe(0);
        });

        it('should not count undefined question answers', function () {
            const emptyAnswerSet = {
                1: {
                    2: undefined
                }
            };
            const noQuestionsAnswered = this.Parser.countNumberOfAnsweredQuestions(emptyAnswerSet);
            expect(noQuestionsAnswered).toBe(0);
        });

        it('should not count empty string answers', function () {
            const emptyAnswerSet = {
                1: {
                    2: ''
                }
            };
            const noQuestionsAnswered = this.Parser.countNumberOfAnsweredQuestions(emptyAnswerSet);
            expect(noQuestionsAnswered).toBe(0);
        });

        it('should count the correct number of mixed questions answered', function () {
            const partialAnswerSet = {
                1: {
                    2: 9,
                    3: 0
                },
                2: {
                    4: null,
                    5: 6,
                    6: ''
                }
            };
            const partialQuestionsAnswered = this.Parser.countNumberOfAnsweredQuestions(partialAnswerSet);
            expect(partialQuestionsAnswered).toBe(2);
        });

        it('should count the correct number when all questions answered', function () {
            const allAnswerSet = {
                1: {
                    1: 1,
                    2: 9,
                    3: 0
                },
                2: {
                    4: 1,
                    5: 6,
                    6: 5
                }
            }
            const allQuestionsAnswered = this.Parser.countNumberOfAnsweredQuestions(allAnswerSet);
            expect(allQuestionsAnswered).toBe(2);
        });
    });

    describe('calculatePercentageComplete function', function () {
        it('should return the 0 percentage when there are no questions', function () {
            this.percentage = this.Parser.calculatePercentageComplete(7, 0);
            expect(this.percentage).toBe(0 + '%');
        });

        it('should return the 0 percentage when none answered', function () {
            this.percentage = this.Parser.calculatePercentageComplete(0, this.totalQuestions);
            expect(this.percentage).toBe(0 + '%');
        });

        it('should return 33% when 2/3 questions answered', function () {
            this.percentage = this.Parser.calculatePercentageComplete(1, this.totalQuestions);
            expect(this.percentage).toBe(33 + '%');
        });

        it('should return 67% when 3/3 questions answered', function () {
            this.percentage = this.Parser.calculatePercentageComplete(2, this.totalQuestions);
            expect(this.percentage).toBe(67 + '%');
        });

        it('should return the 100 percentage when all answered', function () {
            this.percentage = this.Parser.calculatePercentageComplete(3, this.totalQuestions);
            expect(this.percentage).toBe(100 + '%');
        });
    });
});
