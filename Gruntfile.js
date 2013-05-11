module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>' +
                    ' <%= grunt.template.today("yyyy-mm-dd HH:mm") %> */\n'
            },
            dist: {
                src: 'src/js/**/*.js',
                dest: 'dist/jss.min.js'
            }
        },
        clean: {
            build: ["dist"],
            release: ["dist-prod"]
        },
        karma: {
            unit: {
                configFile: 'my.conf.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-karma');

    // Default task(s).
    grunt.registerTask('default', ['clean','uglify','karma']);

};
