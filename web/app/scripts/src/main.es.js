import { angular } from 'libraries';

import Api from 'services/api';
import ProjectConfig from 'providers/project-config';

angular.module('incuna-surveys', [])
    .provider('ProjectConfig', ProjectConfig)
    .service('Api', Api);
