import { angular } from 'libraries';

import API from 'services/api';

const module = angular.module('incuna-surveys', [
    API.moduleName
]);
