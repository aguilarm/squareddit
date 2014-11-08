module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        concat: {
            dev: {
                src: 'public/app/app.js',
                src: 'public/app/services/*.js',
                src: 'public/app/controllers/*.js',
                src: 'public/app/config/*.js',
                dest: 'public/js/squareddit.app.js'
            }
        },
        
        watch: {
            dev: {
                files: ['public/app/*.js'],
                tasks: ['concat']
            }
        },
    });
        
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('dev', ['concat', 'watch']);

};