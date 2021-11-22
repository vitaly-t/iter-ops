const gulp = require('gulp');

const npm = {
    uglify: require('gulp-uglify'),
    sourcemaps: require('gulp-sourcemaps'),
    rename: require('gulp-rename'),
    header: require('gulp-header'),
    gzip: require('gulp-gzip')
};

const SOURCE_FILE = 'iter-ops.js';
const DEST_FILE = 'iter-ops.min.js';
const OUT_DIR = '../dist/web';

const {version} = require('../package.json');

const copyright = `/**
 * iter-ops v${version}
 * Copyright 2021 Vitaly Tomilov
 * Released under the MIT License
 * https://github.com/vitaly-t/iter-ops
 */
`;

gulp.task('minify', () => {
    return gulp.src(SOURCE_FILE)
        .pipe(npm.sourcemaps.init())
        .pipe(npm.uglify())
        .pipe(npm.header(copyright))
        .pipe(npm.rename(DEST_FILE))
        .pipe(npm.sourcemaps.write('.'))
        .pipe(gulp.dest(OUT_DIR));
});

gulp.task('zip', () => {
    return gulp.src(`${OUT_DIR}/${DEST_FILE}`)
        .pipe(npm.gzip({extension: 'gzip'}))
        .pipe(gulp.dest(OUT_DIR));
});

gulp.task('default', gulp.series(['minify', 'zip']));
