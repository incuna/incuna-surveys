import { angular } from 'libraries';

import FieldsetParserService from 'services/fieldsets-parser';
import Api from 'services/api';
import ProjectConfig from 'providers/project-config';

import Test from 'test';

angular.module('incuna-surveys', ['incuna-surveys-fields.templates'])
    .service('FieldsetParserService', FieldsetParserService)
    .service('Templates', function () {
        return {
            header: '<h1></h1>',
            fieldHeader: '<h2></h2>'
        };
    })
    .provider('ProjectConfig', ProjectConfig)
    .service('Api', Api);

Test();
