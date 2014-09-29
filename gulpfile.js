var gulp         = require('gulp'),
    rimraf       = require('rimraf'),
    server       = require('gulp-develop-server'),
    frontMatter  = require('gulp-front-matter'),
    path         = require('path')
    through      = require('through2')
    fs           = require('fs')
    autoprefixer = require('gulp-autoprefixer');

gulp.task('server:start', ['build'], function() {
  server.listen( { path: 'app.js' });
});

gulp.task('clean', function(cb) {
  rimraf('./build', cb);
});

gulp.task('copy', ['clean'], function() {
  return gulp.src(['./client/**/*.*', '!./client/templates/**/*.*'], { base: './client/' } )
    .pipe(gulp.dest('build'));
});

gulp.task('front-matter', ['copy'], function() {
  var config = [];
  var css    = [];

  return gulp.src('./client/templates/*.html')
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
        css.push({ type: 'ng-enter-active', animation: page.animationIn, className: page.className, animationLength: page.animationInLength || '1s'});
      }

      if(page.animationOut) {
        css.push({ type: 'ng-leave-active', animation: page.animationOut, className: page.className, animationLength: page.animationOutLength || '1s'});
      }

      this.push(file);
      return callback();
    }))
    .pipe(gulp.dest('build/templates'))
    .on('end', function() {
      //routes
      console.log('animation');
      var appPath = ['build', 'assets', 'js', 'app.js'];
      var data = fs.readFileSync(appPath.join(path.sep));
      fs.writeFileSync(appPath.join(path.sep), 'var dynamicRoutes = ' + JSON.stringify(config) + '; \n' + data);
      //animation
      var cssPath = ['build', 'assets', 'css', 'animations.css'];
      var cssString = '';
      css.forEach(function(style) {
        cssString += '.'+style.type+'.'+style.className+'{' +
                     'animation-name: '+style.animation + ';' +
                     '  animation-duration: 1s; animation-fill-mode: both;' +
                     '}';
      });

      fs.writeFileSync(cssPath.join(path.sep), cssString);
    })
  ;
});

gulp.task('prefix', ['clean', 'copy', 'front-matter'], function() {
  return gulp.src('./build/assets/**/*.css')
    .pipe(autoprefixer({
      browsers: ['last 3 versions']
    }))
    .pipe(through.obj(function(file, enc, callback) {
      this.push(file);
      return callback();
    }))
    .pipe(gulp.dest('build/assets'))
  ;
});

gulp.task('build', ['copy', 'front-matter', 'prefix'], function() {
  console.log('Successfully built');
});

gulp.task('default', ['build', 'server:start'], function() {
  gulp.watch('./client/**/*.*', ['build', server.restart]);
});
