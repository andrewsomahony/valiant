var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifyCSS = require('gulp-uglifycss');
var util = require('gulp-util');
var gzip = require('gulp-gzip');
var clean = require('gulp-clean');

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
var isCompressed = yargs.compress || false

var canInstall = yargs.install || false;

var JS = ['./main.js'];
var CSS = ['./node_modules/bootstrap/dist/css/bootstrap.css', 
           './node_modules/font-awesome/css/font-awesome.css',
           './node_modules/angular-motion/dist/angular-motion.css', 
           './node_modules/angular-loading-bar/build/loading-bar.css',
           './css/**/*.css', './css/app.scss'];
var VIEWS = ['./views/**/*.html'];

var OUTPUT_JS_FILE = '_app.js';
var OUTPUT_CSS_FILE = '_app.css';

var OUTPUT_BUILD_DIR = "./_build";
var OUTPUT_VIEWS_DIR = "./views";

var OUTPUT_VIEW_FILE = '_views.js';
var VIEW_MODULE_NAME = 'valiant.views';

gulp.task('install', function() {
    if (true === canInstall) {
        exec('./scripts/install.sh', function(err, stdout, stderr) {
            if (err) {
                util.log(err);
            }
        });
    }
});

gulp.task('clear', function() {
    gulp.src(OUTPUT_BUILD_DIR + "/*", {read: false})
		.pipe(clean());    
        
    gulp.src(OUTPUT_VIEWS_DIR + "/" + OUTPUT_VIEW_FILE, {read: false})
        .pipe(clean());
});

gulp.task('javascript', ['views'], function() {
   var code = browserify({
      entries: JS,
      debug: useDebug,
      paths: ['./components/']
   }).bundle().on('error', function(e) {
      util.log(e)
      process.exit(1);
   })

   code = code.pipe(source(OUTPUT_JS_FILE))
              .pipe(buffer())

   if (true === useDebug) {
      code = code.pipe(sourcemaps.init({loadMaps: true}))

      if (true === isProduction) {
         code = code.pipe(uglify())
      }

      if (true === isCompressed) {
          code = code.pipe(gzip());
      }

      code = code.pipe(sourcemaps.write())
   } else {
      if (true === isProduction) {
         code = code.pipe(uglify())
      }
      
      if (true === isCompressed) {
          code = code.pipe(gzip());
      }
   }

   code = code.pipe(gulp.dest(OUTPUT_BUILD_DIR));
   
   return code;
})

gulp.task('views', function() {
   var stream = gulp.src(VIEWS)
   .pipe(templateCache({
            module: VIEW_MODULE_NAME, 
            standalone: true}))
   .pipe(concat(OUTPUT_VIEW_FILE))
   .pipe(gulp.dest(OUTPUT_VIEWS_DIR));
   
   return stream;
})

gulp.task('css', function() {
   var code = gulp.src(CSS)
   .pipe(sass().on('error', sass.logError))
   .pipe(concat(OUTPUT_CSS_FILE))
   
   if (true === isProduction) {
       code = code.pipe(uglifyCSS());
   }
   
   if (true === isCompressed) {
       code = code.pipe(gzip());
   }
   
   code = code.pipe(gulp.dest(OUTPUT_BUILD_DIR));
   
   return code;
})

gulp.task('watch', function() {
   var WATCH_JS = ['./**/*.js', "!./views/*.js", "!./build/**/*.js"]

   gulp.watch(WATCH_JS, ['javascript', 'install']);

   //This will compile the views first
   gulp.watch(VIEWS, ['javascript', 'install']);
   gulp.watch(CSS, ['css', 'install']);
})

gulp.task('default', ['clear', 'javascript', 'css', 'install'], function() {
    });    