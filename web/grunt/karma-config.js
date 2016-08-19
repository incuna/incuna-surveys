module.exports = function (grunt) {
    'use strict';

    const karmaTasksConfig = {
        browsers: ['Firefox'],
        frameworks: ['jasmine', 'browserify', 'fixture'],
        preprocessors: {
            '<%= config.tests %>': ['browserify'],
            '<%= config.compiledScriptsDir %>/**/*.js': ['browserify'],
            '<%= config.jsonFixtures %>/**/*.json': 'json_fixtures'
        },
        jsonFixturesPreprocessor: {
            variableName: '__json__',
            stripPrefix: '<%= config.jsonFixtures %>/'
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
                    files: [
                        '<%= config.libDir %>/angular/angular.js',
                        '<%= config.libDir %>/angular-mocks/angular-mocks.js',
                        '<%= config.jsonFixtures %>/**/*.json',

                        '<%= config.compiledScriptsDir %>/**/*.js',
                        '<%= config.tests %>'
                    ],
                    reporters: ['progress']
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
