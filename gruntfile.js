module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        concat: {
            dev: {
                src: ['public/app/app.js', 'public/app/services/*.js', 'public/app/controllers/*.js', 'public/app/config/*.js', 'public/app/directives/*.js'],
                dest: 'public/js/squareddit.app.js'
            }
        },
        
        watch: {
            dev: {
                files: ['public/app/*.js', 'public/app/**/*.js'],
                tasks: ['concat']
            }
        },
    });
        
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('dev', ['concat', 'watch']);

};