describe('FieldsetParserService', function () {

    beforeEach(function () {
        fixture.setBase('tests/api-description');
        this.fieldset = fixture.load('forms/pk/get.json').OK.response_data;
        this.data = fixture.load('forms/pk/respond/user_id/get.json').OK.response_data;
        this.postResponses = fixture.load('forms/pk/respond/user_id/post.json').fields.user_responses;

        angular.module('formly', []);
        angular.mock.module({
            formlyConfig: {
                setType: angular.noop,
                setWrapper: angular.noop
            }
        });
        angular.mock.module('incuna-surveys.field-parser');

        inject(function (FieldsParser) {
            this.Parser = FieldsParser;
        });

        this.result = this.Parser.parseFields(this.fieldset);
        this.emptyModel = this.Parser.parseFormToModel(this.fieldset);
        this.parsedResposes = this.Parser.parseModelToResponse(this.data);
    });

    describe('parseFieldsets method return array', function () {

        it('should be an array', function () {
            expect(this.result).toEqual(jasmine.any(Array));
        })

        describe('field groups', function () {
            it('should be as many as there are field sets', function () {
                // The api description has 3 fieldsets, the extra element is the header
                expect(this.result.length).toBe(3); 
            });

            describe('each element', function () {
                
                it('should have a header as first element', function () {
                    const fieldGroup = this.result[0];

                    expect(fieldGroup.wrapper).toBe('panel');
                    expect(fieldGroup.templateOptions.name).toBe('Free text field');
                    expect(fieldGroup.templateOptions.description).toBe('Field group description');
                });
                
                it('should have a list of fields', function () {
                    expect(this.result[1].fieldGroup.length).toBe(2);
                });

                describe('each field', function () {
                    it('should have apropriate values', function () {
                        const field = this.result[0].fieldGroup[0];
                        const fieldOptions = field.templateOptions.fieldOptions;

                        expect(field.key).toBe(1);
                        expect(field.type).toBe('free_text');
                        expect(field.templateOptions.fieldSetId).toBe(1);
                        expect(fieldOptions.required).toBe(true);
                        expect(fieldOptions.label).toBe('How did you discover the site?');
                        expect(fieldOptions.help_text).toBe('Search engine, friend...');
                    });

                    it('should have empty choices for non-choice fields', function () {
                        const field = this.result[0].fieldGroup[0];

                        expect(field.templateOptions.choices).toEqual([]);
                    });

                    it('should have a list of choices for choice fields', function () {
                        const field = this.result[2].fieldGroup[0];

                        expect(field.templateOptions.choices).toEqual(['One time', 'Two times', 'Three times or more']);
                    });
                    
                });
                
            });
            
        });

    });

    describe('parseFormToModel model object', function () {

        it('should be an Object', function () {
            expect(this.emptyModel).toEqual(jasmine.any(Object));
        });

        it('should create three empty fieldsets', function () {
            const expected = {
                1: {},
                2: {},
                3: {}
            }
            expect(this.emptyModel).toEqual(expected);
        });
        
    });

    describe('parseModelToResponse object', function () {

        it('should be an Array', function () {
            expect(this.parsedResposes).toEqual(jasmine.any(Array));
        });

        it('should be equal to the post data', function () {
            expect(this.parsedResposes).toEqual(this.postResponses);
        });

    });


});
