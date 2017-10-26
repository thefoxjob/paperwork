const babel = require('gulp-babel');
const fs = require('fs-extra');
const gulp = require('gulp');
const notify = require('gulp-notify');


gulp.task('binary', () => gulp.src('bin/*')
  .pipe(babel())
  .pipe(gulp.dest('dist/bin', { mode: '0755' }))
  .pipe(notify({ message: 'bin/**/* compiled successfully', onLast: true })));

gulp.task('foundation', () => gulp.src('foundation/**/*.{js,jsx}')
  .pipe(babel())
  .pipe(gulp.dest('dist/foundation'))
  .pipe(notify({ message: 'foundation/**/* compiled successfully', onLast: true })));

gulp.task('index', () => gulp.src('index.js')
  .pipe(babel())
  .pipe(gulp.dest('dist/index.js'))
  .pipe(notify({ message: 'indexjs compiled successfully', onLast: true })));

gulp.task('clean', () => fs.remove('./dist'));

gulp.task('watch-binary', () => gulp.watch('bin/**/*', gulp.parallel('binary')));
gulp.task('watch-foundation', () => gulp.watch('foundation/**/*', gulp.parallel('foundation')));
gulp.task('watch-index', () => gulp.watch('index.js', gulp.parallel('index')));

gulp.task('default', gulp.parallel('binary', 'foundation', 'index'));
gulp.task('release', gulp.series('clean', 'default'));
gulp.task('watch', gulp.parallel('default', 'watch-binary', 'watch-foundation', 'watch-index'));
