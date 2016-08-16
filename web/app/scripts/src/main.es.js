import { angular } from 'libraries';

import FieldsetParserService from 'services/fieldsets-parser';
import Api from 'services/api';
import ProjectConfig from 'providers/project-config';

import Test from 'test';

angular.module('incuna-surveys', [
    'incuna-surveys-fields.templates',
    'drf-form-field',
    'aif-slider-input'
])
    .service('FieldsetParserService', FieldsetParserService)
    .provider('ProjectConfig', ProjectConfig)
    .service('Api', Api);

Test();
