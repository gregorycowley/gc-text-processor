module.exports = function(grunt) {

    pkg: grunt.file.readJSON('package.json'),

    // Project configuration.
    grunt.initConfig({
        fileregexrename: {
            dist: {
                files: [{
                        expand: true,
                        cwd: 'src',
                        src: ['*.docx'],
                        dest: 'tmp/'
                }],
                options: {
                    replacements: [{
                        pattern: / /g,
                        replacement: "_"
                    }]
                }
            },
        },
        node_pandoc: {
            options: {
                flags: '-t html5 --ascii'
            },
            convert: {
                files: [{
                    expand: true,
                    cwd: 'input',
                    src: ['*.docx'],
                    dest: 'tmp/',
                    ext: '.html'
                }],
            },
        },
        mkdir: {
            all: {
                options: {
                    mode: 0755,
                    create: ['input', 'output', 'tmp']
                },
            },
        },
        run: {
            options: {
                wait: false,
                passArgs: ['cms']
            },
            verify_content: {
                args: [
                    'index.js',
                    'verify'
                ]
            },
            process: {
                args: [
                    'index.js',
                    'format'
                ]
            },
            setup: {
                args: [
                    'index.js',
                    'cms'
                ]
            }
        }
    });

    // Plugins
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-node-pandoc');
    grunt.loadNpmTasks('grunt-debug');
    grunt.loadNpmTasks('grunt-file-regex-rename');
    grunt.loadNpmTasks('grunt-run');

    // Default task(s).
    grunt.registerTask('default', ['fileregexrename']);

    // Setup
    grunt.registerTask('pandoc', ['node_pandoc']);
    grunt.registerTask('setup', 'Validate files and create directories', function() {
        if ( grunt.file.isDir( 'input' ) && grunt.file.isDir( 'output' ) ) {
            grunt.log.writeln('...folders exist');
        } else {
            grunt.task.run ('mkdir');
        }
    });

    // Checklist:
    //  npm prune
    //  npm doctor
    //  npm cache clean
    //  npm cache verify
    //
    //  npm link/unlink

};


