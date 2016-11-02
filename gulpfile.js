var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concatCss = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');


gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
  })
});

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  // Обновляем браузер при любых изменениях в HTML или JS
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/css/**/*.css', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload); 
});


gulp.task('concat', function () {
     return gulp.src('app/**/*.css')
    .pipe(concatCss("css/main.css"))
    .pipe(gulp.dest('dist'));
});

// gulp.task('minify-css', function() {
//   return gulp.src('dist/css/main.css')
//     .pipe(cleanCSS({compatibility: 'ie8'}))
//     .pipe(gulp.dest('dist/css/'));
// });

gulp.task('useref', function() {

  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function(){
  return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
  // кэширование изображений, прошедших через imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/img'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

gulp.task('PIE', function() {
  return gulp.src('app/css/PIE/**/*')
  .pipe(gulp.dest('dist/css/PIE'))
});

// Cleaning 
gulp.task('clean', function(callback) {
  del('app/css/main.css');
  return cache.clearAll(callback);
});

gulp.task('clean', function(callback) {
  del('dist');
  return cache.clearAll(callback);
});


gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/img', '!dist/img/**/*']);
});


// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync', 'watch'],
    callback
  )
})

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass',
    'concat',
    // 'minify-css',
    ['useref', 'images', 'fonts', 'PIE'],
    callback
  )
})



