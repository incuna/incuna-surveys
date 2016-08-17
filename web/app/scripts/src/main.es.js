import { angular } from 'libraries';

import FieldsetParser from 'services/fieldsets-parser';
import API from 'services/api';
import FieldsConfig from 'services/fields-config';

angular.module('incuna-surveys', [
    'drf-form-field',
    'aif-slider-input',
    'checklist-model',
    FieldsConfig.moduleName,
    FieldsetParser.moduleName,
    API.moduleName
]);
