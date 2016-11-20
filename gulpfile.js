var gulp = require('gulp');

// Include all plugins from package.json
var plugins = require('gulp-load-plugins')({
  replaceString: /^gulp(-|\.)/,
  scope: ['devDependencies'],
  lazy: false
});

// Include styleguide
var runSequence = require('run-sequence');

var params = {
  src : {
    files: './bin/html/',
    sass: './bin/sass/**/*.scss',
    sassDir: './bin/sass/',
    images: './bin/images/'
  },
  dist : {
    files: './dist/',
    css: './dist/css/',
    images: './dist/img/'
  }
};

// Generate html files
gulp.task('files', function() {
  gulp.src([params.src.files+'*.html'])
    .pipe(
      plugins.fileInclude({
        prefix: '@@',
        basepath: '@file'
      })
    )
    .pipe(gulp.dest(params.dist.files));
});

// Minify images
gulp.task('images', function() {
  return gulp.src(params.src.images+'**/*')
    .pipe(
      plugins.imagemin({
        progressive: true,
        svgoPlugins: [{
          removeViewBox: false
        }]
      })
    )
    .pipe(gulp.dest(params.dist.images));
});

// Compile sass files and autoprefixer
gulp.task('sass', function() {
  return gulp.src(params.src.sass)
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(gulp.dest(params.dist.css))
    .pipe(plugins.autoprefixer({
        browsers: [
          'last 2 versions',
          '> 5%'
        ]
      })
    )
    .pipe(gulp.dest(params.dist.css));
});

// Clean css
gulp.task('cssclean', function() {
  return gulp.src(params.dist.css+'styles.css')
    .pipe(
      plugins.combineMq({
        beautify: true
      })
    )
    .pipe(
      plugins.cssnano({
        zindex: false
      })
    )
    .pipe(
      plugins.rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest(params.dist.css))
    .pipe(plugins.livereload());
});

// Generate styles (sass + cssclean)
gulp.task('styles', function(callback){
  runSequence('sass', 'cssclean', callback);
});

gulp.task('watch', function(){
  plugins.livereload.listen();
  gulp.watch('**/*.scss', {cwd: params.src.sassDir}, ['styles']);
  gulp.watch('**/*', {cwd: params.src.images}, ['images']);
  gulp.watch('**/*.html', {cwd: params.src.files}, ['files']);
});

// Default task
gulp.task('default', function(callback){
    runSequence('files', 'images', 'styles', callback);
});