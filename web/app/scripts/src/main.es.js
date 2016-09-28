import { angular } from 'libraries';

import API from 'services/api';
import FieldsConfig from 'services/fields-config';
import SurveysFormDirective from 'directives/form';
import CalculatePercentageDirective from 'directives/calculate-percentage';
import ProportionFieldDirective from 'directives/proportion-field';
import IntegerFielddDirective from 'directives/integer-field';

angular.module('incuna-surveys', [
    'drf-form-field',
    'aif-slider-input',
    'checklist-model',
    FieldsConfig.moduleName,
    API.moduleName,
    SurveysFormDirective.moduleName,
    CalculatePercentageDirective.moduleName,
    ProportionFieldDirective.moduleName,
    IntegerFielddDirective.moduleName
]);
