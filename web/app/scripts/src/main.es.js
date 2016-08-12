/* global console */
// TODO: remove the following two lines
import { angular } from 'libraries';
import FieldsetParserService from 'services/fieldsets-parser';
import Test from 'test';

angular.module('incuna-surveys', [])
    .service('FieldsetParserService', FieldsetParserService)
    .service('Templates', function () {
        return {
            header: '<h1></h1>',
            fieldHeader: '<h2></h2>'
        };
    });
Test();
/* eslint no-console: 0 */
