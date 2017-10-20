const babel = require('gulp-babel');
const copy = require('gulp-copy');
const fs = require('fs-extra');
const gulp = require('gulp');
const notify = require('gulp-notify');


const templateWatchList = [
  'pages/**/*',
  'routes.js',
  'stylesheets/**/*',
  'templates/**/*',
];

gulp.task('binary', () => gulp.src('bin/*')
  .pipe(babel())
  .pipe(gulp.dest('dist/bin', { mode: '0755' }))
  .pipe(notify({ message: 'bin/**/* compiled successfully', onLast: true })));

gulp.task('foundation', () => gulp.src('foundation/**/*.{js,jsx}')
  .pipe(babel())
  .pipe(gulp.dest('dist/foundation'))
  .pipe(notify({ message: 'foundation/**/* compiled successfully', onLast: true })));

gulp.task('copy', () => gulp.src(templateWatchList)
  .pipe(copy('./dist/'))
  .pipe(gulp.dest('./dist')));

gulp.task('clean', () => fs.remove('./dist'));

gulp.task('watch-binary', () => gulp.watch('bin/**/*', gulp.parallel('binary')));
gulp.task('watch-copy', () => gulp.watch(templateWatchList, gulp.parallel('copy')));
gulp.task('watch-foundation', () => gulp.watch('foundation/**/*', gulp.parallel('foundation')));

gulp.task('default', gulp.parallel('binary', 'foundation', 'copy'));
gulp.task('release', gulp.series('clean', 'default'));
gulp.task('watch', gulp.parallel('default', 'watch-binary', 'watch-foundation', 'watch-copy'));
