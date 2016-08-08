/* global module, require */
module.exports = function (grunt) {

    'use strict';

    if (grunt.option('help')) {
        // Load all tasks so they can be viewed in the help: grunt -h or --help.
        require('load-grunt-tasks')(grunt);
    } else {
        // Use jit-grunt to only load necessary tasks for each invocation of grunt.
        require('jit-grunt')(grunt);
    }

    grunt.initConfig({

        config: {
            baseDir: 'app',
            distDir: 'dist',
            libDir: '<%= config.baseDir %>/lib',

            scriptsDir: '<%= config.baseDir %>/scripts',
            srcScriptsDir: '<%= config.scriptsDir %>/src',
            compiledScriptsDir: '<%= config.scriptsDir %>/compiled-es5',

            lintFiles: ['<%= config.srcScriptsDir %>', 'Gruntfile.js']
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
            all: {
                options: {
                    configFile: 'eslint.json'
                },
                src: '<%= config.lintFiles %>'
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
        }
    });

    // - - - T A S K S - - -

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
            'clean',
            'compilejs'
        ]);
    });

    grunt.registerTask('build', function () {
        var tasks = [
            'clean',
            'compilejs',
            'uglify'
        ];
        grunt.task.run(tasks);
    });

};
