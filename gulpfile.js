var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sassGlob = require('gulp-sass-glob'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    plumber = require('gulp-plumber'),
    newer = require('gulp-newer'),
    del = require('del'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    fileinclude = require('gulp-file-include'),
    replace = require('gulp-replace'),
    browserSync = require('browser-sync').create();

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: 'src'
    },
    notify: false,
    open: false
  });
});

gulp.task('styles', function() {
  return gulp.src('src/sass/main.scss')
    .pipe(sassGlob())
    .pipe(plumber())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 10 versions', '> 1%', 'ie 10'], cascade: true }))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function() {
  return gulp.src([
    'src/libs/jquery/dist/jquery.min.js'
    ])
    .pipe(plumber())
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest('src/js'));
});

gulp.task('watch', ['styles', 'scripts', 'browser-sync'], function() {
  gulp.watch('src/sass/**/*.+(sass|scss)', ['styles']);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);
});

gulp.task('clean', function() {
  return del.sync('build');
});

gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    //.pipe(newer('build/img'))
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest('build/img'));
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('build/fonts/'));
});

gulp.task('assets', function() {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('build/assets/'));
});

gulp.task('build', ['clean', 'styles', 'scripts', 'images', 'fonts', 'assets'], function() {

  gulp.src([
    'src/css/main.css'
    ])
  // .pipe(cleanCSS({compatibility: 'ie10'}))
  // .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('build/css'));

  gulp.src([
    'src/js/libs.min.js',
    'src/js/main.js'
    ])
  .pipe(gulp.dest('build/js'));

  gulp.src('src/*.html')
  .pipe(useref({noAssets:true}))
  .pipe(gulp.dest('build'));

});

gulp.task('default', ['watch']);
