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
    return gulp.src('./src/scripts/lib/modernizr.js')
        .pipe(size({showFiles: true}))
        .pipe(gulp.dest('./dist/scripts'));
});

// Scripts
gulp.task('lib', function() {
    return browserify({debug: true})
        .require('jquery')
        .require('lodash/dist/lodash.compat')
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
    return browserify({debug: true})
        .add('./src/scripts/app.js')
        .external('jquery')
        .external('lodash/dist/lodash.compat')
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
    return gulp.src('./dist/scripts/**/*.js')
        .pipe(uglify())
        .pipe(size({showFiles: true}))
        .pipe(gulp.dest('./dist/scripts'));
});

// Styles
gulp.task('styles', function() {
    return gulp.src('./src/styles/app.scss')
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
    return gulp.src('./dist/styles/**/*.css')
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
gulp.task('init', ['modernizr', 'lib', 'scripts', 'styles']);
gulp.task('default', ['browser-sync', 'watch']);
gulp.task('prod', ['scripts:dist', 'styles:dist']);
