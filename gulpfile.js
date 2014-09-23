var gulp = require('gulp'),
    rimraf = require('rimraf'),
    server = require('gulp-develop-server');

gulp.task('server:start', ['copy'], function() {
  server.listen( { path: 'app.js' });
});

gulp.task('clean', function(cb) {
  rimraf('./build', cb);
});

gulp.task('copy', ['clean'], function() {
  gulp.src('./client/**/*.*', { base: './client/' } )
    .pipe(gulp.dest('build'));
});

gulp.task('default', ['copy', 'server:start'], function() {
  gulp.watch('client/**/*.*', ['copy', server.restart]);
});
