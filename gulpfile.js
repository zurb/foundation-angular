var gulp        = require('gulp'),
    rimraf      = require('rimraf'),
    server      = require('gulp-develop-server'),
    frontMatter = require('gulp-front-matter'),
    path        = require('path');

gulp.task('server:start', ['front-matter'], function() {
  server.listen( { path: 'app.js' });
});

gulp.task('clean', function(cb) {
  rimraf('./build', cb);
});

gulp.task('copy', ['clean'], function() {
  gulp.src('./client/**/*.*', { base: './client/' } )
    .pipe(gulp.dest('build'));
});

gulp.task('front-matter', ['copy'], function() {
  var root = [];

  gulp.src('./client/templates/*.html')
    .pipe(frontMatter({
      property: 'meta',
      remove: true
    }))
    .on('data', function(data) {
      page = data.meta;

      //path normalizing
      relativePath = path.relative(__dirname + path.sep + 'client', data.path);
      page.path = relativePath.split(path.sep).join('/');

      root.push(page);
    }).pipe(gulp.dest('build/templates'))
    .on('end', function(data) {
      console.log(root);
      console.log('made it!');
    })
  ;
});

gulp.task('default', ['copy', 'front-matter', 'server:start'], function() {
  gulp.watch('client/**/*.*', ['copy', server.restart]);
});
