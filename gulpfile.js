'use strict';

var browserSync = require('browser-sync'),
    browserify  = require('browserify'),
    gulp        = require('gulp'),
    csso        = require('gulp-csso'),
    notify      = require("gulp-notify"),
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
        .require('fastclick')
        .require('jquery')
        .require('lodash/dist/lodash.compat')
        .bundle()
        .on('error', function(err) {
            this.emit('end');
            return notify().write(err);
        })
        .pipe(source('lib.js'))
        .pipe(buffer())
        .pipe(size({showFiles: true}))
        .pipe(gulp.dest('./dist/scripts'))
        .pipe(notify({message: 'Libs task complete'}));
});

gulp.task('scripts', function() {
    return browserify({debug: true})
        .add('./src/scripts/app.js')
        .external('fastclick')
        .external('jquery')
        .external('lodash/dist/lodash.compat')
        .bundle()
        .on('error', function(err) {
            this.emit('end');
            return notify().write(err);
        })
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(size({showFiles: true}))
        .pipe(gulp.dest('./dist/scripts'))
        .pipe(notify({message: 'Scripts task complete'}));
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
        .pipe(sass())
        .on('error', function(err) {
            this.emit('end');
            return notify().write(err);
        })
        .pipe(sourcemaps.write())
        .pipe(size({showFiles: true}))
        .pipe(gulp.dest('./dist/styles'))
        .pipe(reload({stream: true}))
        .pipe(notify({message: 'Styles task complete'}));
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
        proxy: 'bootstrap-boilerplate.dev'
    });
});

gulp.task('browser-sync-reload', function () {
    browserSync.reload();
});

// Watch
gulp.task('watch', function() {
    gulp.watch('**/*.php', ['browser-sync-reload']);
    gulp.watch('src/scripts/**/*.js', ['scripts', browserSync.reload]);
    gulp.watch('src/styles/**/*.scss', ['styles']);
});

// Arrays
gulp.task('default', ['modernizr', 'lib', 'scripts', 'styles', 'browser-sync', 'watch']);
gulp.task('prod', ['scripts:dist', 'styles:dist']);
