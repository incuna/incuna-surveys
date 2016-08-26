describe('FieldsetParserService', function () {

    beforeEach(function () {
        fixture.setBase('tests/api-description');
        this.fieldset = fixture.load('forms/pk/get.json').OK.response_data;
        this.data = fixture.load('forms/pk/respond/user_id/get.json').OK.response_data;

        angular.module('formly', []);
        angular.mock.module({
            formlyConfig: {
                setType: angular.noop
            }
        });
        angular.mock.module('incuna-surveys.field-parser');

        inject(function (FieldsParser) {
            this.Parser = FieldsParser;
        });

        this.result = this.Parser.parseFields(this.fieldset);
        this.emptyModel = this.Parser.parseFormToModel(this.fieldset);
        this.dataModel = this.Parser.parseResponseToModel(this.data);
    });

    describe('parseFieldsets method return array', function () {

        it('should be an array', function () {
            expect(this.result).toEqual(jasmine.any(Array));
        })

        describe('first element', function () {
            
            it('should contain a header template', function () {
                expect(this.result[0].templateUrl).toContain('/header.html');
            });

            it('should have appropriate templateOptions', function () {
                expect(this.result[0].templateOptions.formName).toBe('How have you been using the site?');
                expect(this.result[0].templateOptions.formDescription).toBe('Form description');
            });

        });

        describe('field groups', function () {
            it('should be as many as there are field sets', function () {
                // The api description has 3 fieldsets, the extra element is the header
                expect(this.result.length).toBe(4); 
            });

            describe('each element', function () {
                
                it('should have a header as first element', function () {
                    const fieldGroup = this.result[1].fieldGroup[0];

                    expect(fieldGroup.templateUrl).toContain('fieldset-header.html');
                    expect(fieldGroup.templateOptions.fieldGroupName).toBe('Free text field');
                    expect(fieldGroup.templateOptions.fieldGroupDesc).toBe('Field group description');
                });
                
                it('should have a list of fields', function () {
                    expect(this.result[2].fieldGroup.length).toBe(3);
                });

                describe('each field', function () {
                    it('should have apropriate values', function () {
                        const field = this.result[1].fieldGroup[1];
                        const fieldOptions = field.templateOptions.fieldOptions;

                        expect(field.key).toBe(1);
                        expect(field.type).toBe('free_text');
                        expect(field.templateOptions.fieldSetIndex).toBe(0);
                        expect(fieldOptions.required).toBe(true);
                        expect(fieldOptions.label).toBe('How did you discover the site?');
                        expect(fieldOptions.help_text).toBe('Search engine, friend...');
                    });

                    it('should have empty choices for non-choice fields', function () {
                        const field = this.result[1].fieldGroup[1];

                        expect(field.templateOptions.choices).toEqual([]);
                    });

                    it('should have a list of choices for choice fields', function () {
                        const field = this.result[3].fieldGroup[1];

                        expect(field.templateOptions.choices).toEqual(['One time', 'Two times', 'Three times or more']);
                    });
                    
                });
                
            });
            
        });

    });

    describe('parseFormToModel model object', function () {

        it('should be an Array', function () {
            expect(this.emptyModel).toEqual(jasmine.any(Array));
        });

        it('should create as many elements as there are fieldsets', function () {
            expect(this.emptyModel.length).toBe(3);
        });

        describe('each fieldset', function () {
            
            it('should have a proper 1-based number', function () {
                expect(this.emptyModel[0].fieldset).toBe(1);
                expect(this.emptyModel[1].fieldset).toBe(2);
                expect(this.emptyModel[2].fieldset).toBe(3);
            });

            it('should have an empty answers object', function () {
                expect(this.emptyModel[0].answers).toEqual({});
                expect(this.emptyModel[1].answers).toEqual({});
                expect(this.emptyModel[2].answers).toEqual({});
            });
            
        });
        
    });

    describe('parseResponseToModel model object', function () {
        it('should be an Object', function () {
            expect(this.dataModel).toEqual(jasmine.any(Array));
        });

        it('should create as many elements as there are keys', function () {
            expect(this.dataModel.length).toBe(3);
        });

        describe('each fieldset', function () {
            
            it('should have a proper 1-based number', function () {
                expect(this.dataModel[0].fieldset).toBe('1');
                expect(this.dataModel[1].fieldset).toBe('2');
                expect(this.dataModel[2].fieldset).toBe('3');
            });

            it('should have answers object', function () {
                expect(this.dataModel[0].answers).toEqual(this.data[1]);
                expect(this.dataModel[1].answers).toEqual(this.data[2]);
                expect(this.dataModel[2].answers).toEqual(this.data[3]);
            });

        });

    });
    
});
