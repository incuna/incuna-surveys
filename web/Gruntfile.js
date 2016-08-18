/* global module, require */

'use strict';

module.exports = function (grunt) {

    if (grunt.option('help')) {
        // Load all tasks so they can be viewed in the help: grunt -h or --help.
        require('load-grunt-tasks')(grunt);
    } else {
        // Use jit-grunt to only load necessary tasks for each invocation of grunt.
        require('jit-grunt')(grunt, {
            ngtemplates: 'grunt-angular-templates'
        });
    }

    const ngTemplatesPaths = require('./node_modules/grunt-incuna-plugins/helper-functions/ng-templates-paths')();

    grunt.initConfig({

        config: {
            baseDir: 'app',
            distDir: 'dist',
            testsDir: 'tests',
            tests: '<%= config.testsDir %>/**/*.js',
            jsonFixtures: '<%= config.testsDir %>/api-description',
            libDir: '<%= config.baseDir %>/lib',

            scriptsDir: '<%= config.baseDir %>/scripts',
            srcScriptsDir: '<%= config.scriptsDir %>/src',
            compiledScriptsDir: '<%= config.scriptsDir %>/compiled-es5',

            lintFiles: {
                node: ['Gruntfile.js'],
                es: ['<%= config.srcScriptsDir %>']
            }
        }

    });

    grunt.config.merge({
        watch: {
            es: {
                files: [
                    '<%= config.srcScriptsDir %>/**/*.es.js'
                ],
                tasks: [
                    'compilejs'
                ]
            },
            ngtemplates: {
                files: ['app/templates/**/*.html'],
                tasks: ['build']
            }
        },
        browserify: {
            all: {
                files: {
                    '<%= config.distDir %>/incuna-forms.js': '<%= config.compiledScriptsDir %>/**/*.js'
                }
            }
        },
        babel: {
            all: {
                options: {
                    presets: ['es2015'],
                    resolveModuleSource: (source) => `./${source}.js`
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.srcScriptsDir %>',
                    src: ['**/*.es.js'],
                    dest: '<%= config.compiledScriptsDir %>',
                    ext: '.js'
                }]
            }
        },
        eslint: {
            node: {
                options: {
                    configFile: '.eslintrc.node'
                },
                src: '<%= config.lintFiles.node %>'
            },
            es: {
                options: {
                    configFile: '.eslintrc.es'
                },
                src: '<%= config.lintFiles.es %>'
            }
        },
        jscs: {
            all: {
                files: ['<%= config.lintFiles %>']
            }
        },
        clean: ['<%= config.compiledScriptsDir %>', '<%= config.distDir %>'],
        connect: {
            dev: {
                options: {
                    base: '<%= config.baseDir %>',
                    port: 9000
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= config.distDir %>/incuna-forms.min.js': '<%= config.distDir %>/incuna-forms.js'
                }
            }
        },
        ngtemplates: ngTemplatesPaths.generate('incuna-surveys', 'app', '<%= config.compiledScriptsDir %>')
    });

    // - - - T A S K S - - -

    grunt.loadTasks('./grunt');

    grunt.registerTask('default', 'dev');

    grunt.registerTask('dev', function () {
        grunt.task.run([
            'compilejs',
            'connect',
            'watch'
        ]);
    });

    grunt.registerTask('compilejs', function () {
        grunt.task.run([
            'babel',
            'browserify'
        ]);
    });

    grunt.registerTask('test', function () {
        grunt.task.run([
            'eslint',
            'jscs',
            'clean',
            'build',
            'karma:ci'
        ]);
    });

    grunt.registerTask('build', function () {
        var tasks = [
            'clean',
            'ngtemplates',
            'compilejs',
            'uglify'
        ];
        grunt.task.run(tasks);
    });

};
