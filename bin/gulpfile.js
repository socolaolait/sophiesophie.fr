var gulp = require('gulp'),
    plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');

var path = {
  src : {
    images : 'images/**/*',
    sass : 'sass/**/*.scss',
    scripts : 'scripts/**/*.js'
  },
  dest : {
    images : '../images',
    css : '../css',
    js : '../js'
  }
};

gulp.task('images:dev', function(){
  gulp.src(path.src.images)
    .pipe(gulp.dest(path.dest.images));
});

gulp.task('images:prod', function(){
  gulp.src(path.src.images)
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(path.dest.images));
});

gulp.task('styles:dev', function(){
  gulp.src([path.src.sass])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass({
            outputStyle: 'expanded' // Style of compiled CSS
        }))
    .pipe(autoprefixer('last 2 versions', '> 5 %'))
    .pipe(gulp.dest(path.dest.css))
});

gulp.task('styles:prod', function(){
  gulp.src([path.src.sass])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass({
            outputStyle: 'compressed' // Style of compiled CSS
        }))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(path.dest.css))
    .pipe(minifycss())
    .pipe(gulp.dest(path.dest.css))
});

gulp.task('scripts:dev', function(){
  return gulp.src(path.src.scripts)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(path.dest.js))
});

gulp.task('scripts:prod', function(){
  return gulp.src(path.src.scripts)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(path.dest.js))
    .pipe(uglify())
    .pipe(gulp.dest(path.dest.js))
});

gulp.task('default', function(){
  gulp.watch( path.src.sass, ['styles:dev'] );
  gulp.watch( path.src.scripts, ['scripts:dev'] );
  gulp.watch( path.src.images, ['images:dev'] );
});

// Default gulp task
gulp.task('dev', ['styles:dev', 'scripts:dev', 'images:dev']);

// Default gulp task
gulp.task('prod', ['styles:prod', 'scripts:prod', 'images:prod']);
