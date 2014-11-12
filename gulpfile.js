'use strict';

var browserSync = require('browser-sync'),
    browserify  = require('browserify'),
    gulp        = require('gulp'),
    csso        = require('gulp-csso'),
    sass        = require('gulp-sass'),
    size        = require('gulp-size'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    buffer      = require('vinyl-buffer'),
    source      = require('vinyl-source-stream'),
    reload      = browserSync.reload;

// Modernizr
gulp.task('modernizr', function() {
    gulp.src('./src/scripts/lib/modernizr.js')
        .pipe(size({showFiles: true}))
        .pipe(gulp.dest('./dist/scripts'));
});

// Scripts
gulp.task('lib', function() {
  browserify({debug: true})
    .require('./src/scripts/lib/bootstrap')
    .require('./src/scripts/lib/jquery')
    .require('./src/scripts/lib/lodash', {expose: 'underscore'})
    .bundle()
    .on('error', function(err) {
        console.log('[browserify] ' + err.message);
        this.emit('end');
    })
    .pipe(source('lib.js'))
    .pipe(buffer())
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('scripts', function() {
    browserify({debug: true})
        .add('./src/scripts/app.js')
        .bundle()
        .on('error', function(err) {
            console.log('[browserify] ' + err.message);
            this.emit('end');
        })
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(size({showFiles: true}))
        .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('scripts:dist', function() {
    gulp.src('./dist/scripts/**/*.js')
        .pipe(uglify())
        .pipe(size({showFiles: true}))
        .pipe(gulp.dest('./dist/scripts'));
});

// Styles
gulp.task('styles', function() {
    gulp.src('./src/styles/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(sourcemaps.write())
        .pipe(size({showFiles: true}))
        .pipe(gulp.dest('./dist/styles'))
        .pipe(reload({stream: true}));
});

gulp.task('styles:dist', function() {
    gulp.src('./dist/styles/**/*.css')
        .pipe(csso())
        .pipe(size({showFiles: true}))
        .pipe(gulp.dest('./dist/styles'))
        .pipe(reload({stream: true}));
});

// BrowserSync
gulp.task('browser-sync', function() {
    browserSync({
        proxy: 'localhost/bootstrap-boilerplate'
    });
});

gulp.task('browser-sync-reload', function () {
    browserSync.reload();
});

// Watch
gulp.task('watch', function() {
    gulp.watch('**/*.php', ['browser-sync-reload']);
    gulp.watch('src/scripts/**/*.js', ['scripts', 'browser-sync-reload']);
    gulp.watch('src/styles/**/*.scss', ['styles']);
});

// Arrays
gulp.task('default', ['modernizr', 'lib', 'scripts', 'styles', 'browser-sync', 'watch']);
gulp.task('prod', ['scripts:dist', 'styles:dist']);
