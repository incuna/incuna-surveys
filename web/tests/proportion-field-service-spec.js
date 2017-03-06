describe('proportion-field service', function () {
    beforeEach(function () {

        angular.mock.module('incuna-surveys.proportion-field');

        inject(function (proportionField) {
            this.proportionField = proportionField;
        });

        this.fields = [
            {
                label: 'One', required: false, id: '1-0'
            },
            {
                label: 'Two', required: false, id: '1-1'
            },
            {
                label: 'Three', required: false, id: '1-2'
            },
            {
                label: 'Four', required: false, id: '1-3'
            }
        ];

        this.values = {
            0: 10,
            1: 20,
            2: 40,
            3: 30
        };

    });

    describe('buildFields', function () {
        it('should return fields', function () {
            const choices = ['One', 'Two', 'Three', 'Four'];
            const defaults = {
                required: false
            };
            const autoId = 1;
            const fields = this.proportionField.buildFields(choices, defaults, autoId);
            expect(fields).toEqual(this.fields);
        });
    });

    describe('calculateTotal', function () {

        it('should sum the values', function () {
            const total = this.proportionField.calculateTotal(this.values);
            expect(total).toEqual(100);
        });

        it('should handle non integers', function () {
            const values = {
                0: 'not a number',
                1: 20,
                2: 40,
                3: 30
            };

            const total = this.proportionField.calculateTotal(values);
            expect(total).toEqual(90);
        });

        it('should handle null and undefined', function () {
            const values = {
                0: 10,
                1: undefined,
                2: 40,
                3: null
            };

            const total = this.proportionField.calculateTotal(values);
            expect(total).toEqual(50);
        });

        it('should handle no integers', function () {
            const values = {
                0: 'not a number',
                1: 'not a number',
                2: 'not a number',
                3: 'not a number'
            };

            const total = this.proportionField.calculateTotal(values);
            expect(total).toEqual(0);
        });

        it('should handle empty values', function () {
            const values = {};

            const total = this.proportionField.calculateTotal(values);
            expect(total).toEqual(0);
        });

        it('should handle undefined', function () {
            const total = this.proportionField.calculateTotal(undefined);
            expect(total).toEqual(0);
        });

        it('should handle null', function () {
            const total = this.proportionField.calculateTotal(null);
            expect(total).toEqual(0);
        });

    });

    describe('addErrors', function () {
        it('should add errors to the fields based on the errors', function () {
            const errors = {
                1: ['A valid integer is required.'],
                3: ['A valid integer is required.']
            };

            this.proportionField.addErrors(this.fields, errors);
            const expected = [
                {
                    label: 'One', required: false, id: '1-0', errors: undefined
                },
                {
                    label: 'Two', required: false, id: '1-1', errors: errors['1']
                },
                {
                    label: 'Three', required: false, id: '1-2', errors: undefined
                },
                {
                    label: 'Four', required: false, id: '1-3', errors: errors['3']
                }
            ]
            expect(this.fields).toEqual(expected);
        });

        it('should clear old errors from fields', function () {
            const errors = ['A valid integer is required.'];
            const fields = [
                {
                    label: 'One', required: false, id: '1-0', errors: undefined
                },
                {
                    label: 'Two', required: false, id: '1-1', errors: errors
                },
                {
                    label: 'Three', required: false, id: '1-2', errors: undefined
                },
                {
                    label: 'Four', required: false, id: '1-3', errors: errors
                }
            ];
            const expected = [
                {
                    label: 'One', required: false, id: '1-0', errors: undefined
                },
                {
                    label: 'Two', required: false, id: '1-1', errors: undefined
                },
                {
                    label: 'Three', required: false, id: '1-2', errors: undefined
                },
                {
                    label: 'Four', required: false, id: '1-3', errors: undefined
                }
            ];
            this.proportionField.addErrors(fields, []);
            expect(fields).toEqual(expected);
        });
    });

});

