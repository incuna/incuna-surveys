module.exports = function (grunt) {
    'use strict';

    const unitTests =  grunt.config('config.tests');

    const karmaTasksConfig = {
        browsers: ['Firefox'],
        frameworks: ['jasmine', 'browserify'],
        preprocessors: {
            [unitTests]: ['browserify'],
            '<%= config.compiledScriptsDir %>/**/*.js': ['browserify']
        },
        browserify: {
            debug: true,
            paths: '<%= config.scriptsDir %>'
        }
    };

    const configure = function () {
        grunt.config.merge({
            karma: {
                options: {
                    files: ['<%= config.compiledScriptsDir %>/**/*.js', unitTests]
                },
                dev: karmaTasksConfig,
                ci: Object.assign(
                    {
                        options: {
                            singleRun: true
                        }
                    },
                    karmaTasksConfig
                )
            }
        });
    };

    configure();
};
