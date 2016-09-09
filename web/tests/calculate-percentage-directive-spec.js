describe('calculatePercentage directive', function() {
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
    const getResponse = {any: 'Any'};
    const answers = {
        1: {
            2: 9,
            3: 0
        },
        2: {
            4: 3,
            5: 6,
        }
    }

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

    it('should call this.calculateCompletionPercent.countQuestionsTotal with the questionSet', function() {
        spyOn(this.calculateCompletionPercent, 'countQuestionsTotal').and.returnValue(questionSet);
    });

    it('should call this.calculateCompletionPercent.countNumberOfAnsweredQuestions with the answer set', function() {
        spyOn(this.calculateCompletionPercent, 'countNumberOfAnsweredQuestions').and.returnValue(answers);
    });
});
