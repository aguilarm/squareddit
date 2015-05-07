var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
  gulp.src('./public/sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({errLogToConsole: true}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css')
  );
});

gulp.task('scripts', function() {
  return gulp.src('./public/app/**/*.js')
    .pipe(concat('squareddit.app.js'))
    .pipe(gulp.dest('./public/js/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
  livereload.listen({host: null});
  gulp.watch('./public/sass/**/*.scss', ['sass']);
  gulp.watch('./public/css/**/*.css').on('change', livereload.changed);
  gulp.watch('./public/app/**/*.js', ['scripts']);
});

//Default task
gulp.task('default', ['scripts', 'sass', 'watch']);