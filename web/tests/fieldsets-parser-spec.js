describe('FieldsetParserService', function () {

    beforeEach(function () {
        fixture.setBase('tests/api-description');
        this.fieldset = fixture.load('forms/pk/get.json').OK.response_data;

        this.mockTemplates = {
            header: '<h1></h1>',
            fieldHeader: '<h2></h2>'
        };

        this.Parser = require('compiled-es5/services/fieldsets-parser').FieldsetParserService(
            this.mockTemplates
        );
        this.result = this.Parser.parseFields(this.fieldset);
        this.model = this.Parser.parseModel(this.fieldset);
    });

    describe('parseFieldsets method return array', function () {

        it('should be an array', function () {
            expect(this.result).toEqual(jasmine.any(Array));
        })

        describe('first element', function () {
            
            it('should contain a header template', function () {
                expect(this.result[0].template).toBe(this.mockTemplates.header);
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
                    let fieldGroup = this.result[1].fieldGroup[0];

                    expect(fieldGroup.template).toBe(this.mockTemplates.fieldHeader); 
                    expect(fieldGroup.templateOptions.fieldGroupName).toBe('Free text field');
                    expect(fieldGroup.templateOptions.fieldGroupDesc).toBe('Field group description');
                });
                
                it('should have a list of fields', function () {
                    expect(this.result[2].fieldGroup.length).toBe(3);
                });

                describe('each field', function () {
                    it('should have apropriate values', function () {
                        let field = this.result[1].fieldGroup[1];

                        expect(field.key).toBe(1);
                        expect(field.type).toBe('free_text');
                        expect(field.templateOptions.label).toBe('How did you discover the site?');
                        expect(field.templateOptions.fieldSetIndex).toBe(0);
                    });
                    
                });
                
                
            });
            
        });

    });

    describe('model object', function () {

        it('should be an Array', function () {
            expect(this.model).toEqual(jasmine.any(Array));
        });

        it('should create as many elements as there are fieldsets', function () {
            expect(this.model.length).toBe(3);
        });

        describe('each fieldset', function () {
            
            it('should have a proper 1-based number', function () {
                expect(this.model[0].fieldset).toBe(1);
                expect(this.model[1].fieldset).toBe(2);
                expect(this.model[2].fieldset).toBe(3);
            });

            it('should have an empty answers object', function () {
                expect(this.model[0].answers).toEqual({});
                expect(this.model[1].answers).toEqual({});
                expect(this.model[2].answers).toEqual({});
            });
            
            
            
        });
        
        
        
    });
    
});
