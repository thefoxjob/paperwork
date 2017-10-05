const gulp = require('gulp');
const babel = require('gulp-babel');
const notify = require('gulp-notify');


gulp.task('binary', () => gulp.src('bin/*')
  .pipe(babel())
  .pipe(gulp.dest('dist/bin', { mode: '0755' }))
  .pipe(notify({ message: 'bin/**/* compiled successfully', onLast: true }))
);

gulp.task('foundation', () => gulp.src('foundation/**/*.{js,jsx}')
  .pipe(babel())
  .pipe(gulp.dest('dist/foundation'))
  .pipe(notify({ message: 'foundation/**/* compiled successfully', onLast: true }))
);

gulp.task('watch-binary', () => gulp.watch('bin/**/*', gulp.parallel('binary')));
gulp.task('watch-foundation', () => gulp.watch('foundation/**/*', gulp.parallel('foundation')));

gulp.task('default', gulp.parallel('binary', 'foundation'));
gulp.task('watch', gulp.parallel('default', 'watch-binary', 'watch-foundation'));

