describe('calculatePercentage directive', function () {
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
                            important: true
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
            3: ''
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
        spyOn(this.calculateCompletionPercent, 'getImportantQuestionKeys').and.callThrough();
        spyOn(this.calculateCompletionPercent, 'countNumberOfAnsweredQuestions').and.callThrough();
    });

    it('should call this.calculateCompletionPercent.getImportantQuestionKeys with the questionSet', function () {
        this.scope.fields = questionSet;
        this.compileDirective(this.tpl);
        expect(this.calculateCompletionPercent.getImportantQuestionKeys).toHaveBeenCalledWith(questionSet)
    });

    it('should return an array of keys', function () {
        const keys = this.calculateCompletionPercent.getImportantQuestionKeys(questionSet);
        expect(keys).toEqual([ 2, 3, 2, 3 ]);
    });

    it('should call this.calculateCompletionPercent.countNumberOfAnsweredQuestions with the answer set', function () {
        const keys = this.calculateCompletionPercent.getImportantQuestionKeys(questionSet);
        this.scope.fields = questionSet;
        this.scope.getResponse = answers;
        this.compileDirective(this.tpl);
        expect(this.calculateCompletionPercent.countNumberOfAnsweredQuestions).toHaveBeenCalledWith(answers, keys);
    });

    it('should return the percentage complete', function () {
        const keys  = this.calculateCompletionPercent.getImportantQuestionKeys(questionSet);
        const answersCount = this.calculateCompletionPercent.countNumberOfAnsweredQuestions(answers, keys);
        const percentage = this.calculateCompletionPercent.calculatePercentageComplete(answersCount, keys.length);
        expect(percentage).toEqual('50%');
    });
});
