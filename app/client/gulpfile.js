var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
//var browserify = require('gulp-browserify')

var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');

var browserify = require('browserify')
var rename = require('gulp-rename')
var templateCache = require('gulp-angular-templatecache')
var Q = require('q')

var exec = require('child_process').exec

var yargs = require('yargs').argv

var isProduction = yargs.production || false
var useDebug = yargs.debug || false

var canInstall = yargs.install || false;

var JS = ['./main.js']
var CSS = ['./node_modules/bootstrap/dist/css/bootstrap.css', './css/*.css', './css/app.scss']
var VIEWS = ['./views/**/*.html']

var OUTPUT_JS_FILE = '_app.js'
var OUTPUT_CSS_FILE = '_app.css'

var OUTPUT_BUILD_DIR = "./_build"
var OUTPUT_VIEWS_DIR = "./views"

var OUTPUT_VIEW_FILE = '_views.js'
var VIEW_MODULE_NAME = 'app.views'

gulp.task('install', function() {
    if (true === canInstall) {
        exec('./scripts/install.sh', function(err, stdout, stderr) {
            if (err) {
                util.log(err);
            }
        });
    }
})

gulp.task('javascript', ['views'], function() {
   var code = browserify({
      entries: JS,
      debug: useDebug
   }).bundle().on('error', function(e) {
      util.log(e)
      this.end()
   })

   code = code.pipe(source(OUTPUT_JS_FILE))
              .pipe(buffer())

   if (true === useDebug)
   {
      code = code.pipe(sourcemaps.init({loadMaps: true}))

      if (true === isProduction)
      {
         code = code.pipe(uglify())
      }

      code = code.pipe(sourcemaps.write('./'))
   }
   else
   {
      if (true === isProduction)
      {
         code = code.pipe(uglify())
      }      
   }

   code.pipe(gulp.dest(OUTPUT_BUILD_DIR));
})

gulp.task('views', function() {
   gulp.src(VIEWS)
   .pipe(templateCache({
            module: VIEW_MODULE_NAME, 
            standalone: true}))
   .pipe(concat(OUTPUT_VIEW_FILE))
   .pipe(gulp.dest(OUTPUT_VIEWS_DIR))
})

gulp.task('css', function() {
   gulp.src(CSS)
   .pipe(sass().on('error', sass.logError))
   .pipe(concat(OUTPUT_CSS_FILE))
   .pipe(gulp.dest(OUTPUT_BUILD_DIR))
})

gulp.task('watch', function() {
   var WATCH_JS = ['./**/*.js', "!./views/*.js", "!./build/**/*.js"]

   gulp.watch(WATCH_JS, ['javascript', 'install']);

   //This will compile the views first
   gulp.watch(VIEWS, ['javascript', 'install']);
   gulp.watch(CSS, ['css', 'install']);
})

gulp.task('default', ['javascript', 'css', 'install'], function() {
    });    