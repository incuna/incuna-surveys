module.exports = function (grunt) {
    'use strict';

    const karmaTasksConfig = {
        browsers: ['Firefox'],
        frameworks: ['jasmine', 'browserify'],
        preprocessors: {
            '<%= config.tests %>': ['browserify'],
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
                    files: ['<%= config.compiledScriptsDir %>/**/*.js', '<%= config.tests %>']
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
