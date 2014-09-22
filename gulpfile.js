var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    clean = require('gulp-clean');

gulp.task('webserver', function() {
  gulp.src('')
    .pipe(webserver({
      livereload: true,
      open: true,
      fallback: '/build/index.html' //html5mode
    }));
});

gulp.task('clean', function() {
  gulp.src('build', { read: false })
    .pipe(clean());
});

gulp.task('copy', ['clean'], function() {
  gulp.src('./client/**/*.*', { base: './client/' } )
    .pipe(gulp.dest('build'));
});

gulp.task('default', ['copy', 'webserver'], function() {
  gulp.watch('client/**/*.*', ['copy', 'webserver']);
});
