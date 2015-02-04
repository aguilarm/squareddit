module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        concat: {
            dev: {
                src: [
                        'public/app/app.module.js',
                        'public/app/app.routes.js',
                        'public/app/*.js',
                        'public/app/**/*.js',
                    ],
                dest: 'public/dist/js/squareddit.app.js'
            }
        },
        
        uglify: {
            dev: {
                files: {
                    'public/dist/js/squareddit.app.min.js': ['public/dist/js/squareddit.app.js']
                }
            }
        },
        
        watch: {
            dev: {
                files: ['public/app/*.js', 'public/app/**/*.js'],
                tasks: ['concat', 'uglify']
            }
        },
    });
        
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('dev', ['concat', 'uglify', 'watch']);

};