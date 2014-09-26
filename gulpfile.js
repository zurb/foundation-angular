var gulp         = require('gulp'),
    rimraf       = require('rimraf'),
    server       = require('gulp-develop-server'),
    frontMatter  = require('gulp-front-matter'),
    path         = require('path')
    through      = require('through2')
    fs           = require('fs')
    autoprefixer = require('gulp-autoprefixer');

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
  var css    = [];

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
      page.className = 'route-' + page.name.replace(/\./, '-').toLowerCase();

      config.push(page);

      if(page.animationIn) {
        css.push({ type: 'ng-enter', animation: page.animationIn, className: page.className, animationLength: page.animationInLength || '1s'});
      }

      if(page.animationOut) {
        css.push({ type: 'ng-leave', animation: page.animationOut, className: page.className, animationLength: page.animationOutLength || '1s'});
      }

      this.push(file);
      return callback();
    }))
    .pipe(gulp.dest('build/templates'))
    .on('end', function() {
      //routes
      var appPath = ['build', 'assets', 'js', 'app.js'];
      fs.readFile(appPath.join(path.sep), function(err, data) {
        fs.writeFile(appPath.join(path.sep), 'var dynamicRoutes = ' + JSON.stringify(config) + '; \n' + data, function(err, d) {
          if (err) return console.log(err);
        });
      });

      //animation
      var cssPath = ['build', 'assets', 'css', 'animations.css'];
      var cssString = '';
      css.forEach(function(style) {
        cssString += '.'+style.type+'.'+style.className+'{' +
                     'animation-name: '+style.animation + ';' +
                     '  animation-duration: 1s; animation-fill-mode: both; color: blue;' +
                     '}';
      });

      fs.writeFile(cssPath.join(path.sep), cssString, function(err, d) {
        if (err) return console.log(err);
      });
    });
  ;
});

gulp.task('prefix', ['copy', 'front-matter'], function() {
  gulp.src('./build/assets/**/*.css')
    .pipe(autoprefixer({
      browsers: ['last 3 version']
    }))
    .pipe(gulp.dest('build/'))
  ;
});

gulp.task('build', ['copy', 'front-matter', 'prefix'], function() {
  console.log('Successfully built');
});

gulp.task('default', ['build', 'server:start'], function() {
  gulp.watch('client/**/*.*', ['build', server.restart]);
});
