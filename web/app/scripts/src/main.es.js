import { angular } from 'libraries';

import API from 'services/api';
import FieldsConfig from 'services/fields-config';
import SurveysFormDirective from 'directives/form';
import CalculatePercentageDirective from 'directives/calculate-percentage';

angular.module('incuna-surveys', [
    'drf-form-field',
    'aif-slider-input',
    'checklist-model',
    FieldsConfig.moduleName,
    API.moduleName,
    SurveysFormDirective.moduleName,
    CalculatePercentageDirective.moduleName
]);
