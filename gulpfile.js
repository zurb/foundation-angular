var gulp        = require('gulp'),
    rimraf      = require('rimraf'),
    server      = require('gulp-develop-server'),
    frontMatter = require('gulp-front-matter'),
    path        = require('path')
    through     = require('through2')
    fs          = require('fs');

gulp.task('server:start', ['front-matter'], function() {
  server.listen( { path: 'app.js' });
});

gulp.task('clean', function(cb) {
  rimraf('./build', cb);
});

gulp.task('copy', ['clean'], function() {
  gulp.src(['./client/**/*.*', '!./client/templates/**/*.*'], { base: './client/' } )
    .pipe(gulp.dest('build'));
});

gulp.task('front-matter', ['copy'], function() {
  var config = [];

  gulp.src('./client/templates/*.html')
    .pipe(frontMatter({
      property: 'meta',
      remove: true
    }))
    .pipe(through.obj(function(file, enc, callback) {
      var page = file.meta;

      //path normalizing
      var relativePath = path.relative(__dirname + path.sep + 'client', file.path);
      page.path = relativePath.split(path.sep).join('/');

      config.push(page);

      this.push(file);
      return callback();
    }))
    .pipe(gulp.dest('build/templates'))
    .on('end', function() {
      var appPath = ['build', 'assets', 'js', 'app.js'];
      fs.readFile(appPath.join(path.sep), function(err, data) {
        fs.writeFile(appPath.join(path.sep), 'var dynamicRoutes = ' + JSON.stringify(config) + '; \n' + data, function(err, d) {
          if (err) return console.log(err);
        });
      })
    });
  ;
});

gulp.task('default', ['copy', 'front-matter', 'server:start'], function() {
  gulp.watch('client/**/*.*', ['copy', 'front-matter', server.restart]);
});
