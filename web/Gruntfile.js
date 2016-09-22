/* global module, require */

'use strict';

module.exports = function (grunt) {

    if (grunt.option('help')) {
        // Load all tasks so they can be viewed in the help: grunt -h or --help.
        require('load-grunt-tasks')(grunt);
    } else {
        // Use jit-grunt to only load necessary tasks for each invocation of grunt.
        require('jit-grunt')(grunt, {
            swig: 'grunt-swig-templates',
            ngtemplates: 'grunt-angular-templates'
        });
    }

    const ngTemplatesPaths = require('grunt-incuna-plugins')['ng-templates-paths']();

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

            templates: {
                sourceDir: 'templates/twig-source',
                sourceFiles: '<%= config.templates.sourceDir %>/**/*.html',
                generatedDir: 'templates/generated',
                generatedFiles: '<%= config.templates.generatedDir %>/**/*.html'
            },

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
                    '<%= config.srcScriptsDir %>/**/*.es.js',
                    '<%= config.compiledScriptsDir %>/**/templates.js'
                ],
                tasks: [
                    'compilejs',
                    'uglify'
                ]
            },
            swig: {
                files: [
                    '<%= config.templates.sourceFiles %>'
                ],
                tasks: [
                    'orderedSwig'
                ]
            },
            ngtemplates: {
                files: ['<%= config.templates.generatedFiles %>'],
                tasks: ['ngtemplates']
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
        swig: {
            all: {
                expand: true,
                cwd: '<%= config.templates.sourceDir %>',
                src: [
                    '**/*.html'
                ],
                dest: '<%= config.templates.generatedDir %>'
            }
        },
        clean: {
            js: [
                '<%= config.compiledScriptsDir %>',
                '<%= config.distDir %>'
            ],
            swig: [
                '<%= config.templates.generatedDir %>'
            ]
        },
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
            'build',
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

    grunt.registerTask('orderedSwig', [
        'clean:swig',
        'swig:all'
    ]);

    grunt.registerTask('compileTemplates', [
        'orderedSwig',
        'ngtemplates'
    ]);

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
            'compileTemplates',
            'compilejs',
            'uglify'
        ];
        grunt.task.run(tasks);
    });

};
