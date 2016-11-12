var gulp = require('gulp');
const babel = require('gulp-babel');
const es = require('event-stream');

gulp.task('default', () => {
  return es.concat(
    gulp.src('./src/data/**/*')
      .pipe(gulp.dest('./dist/data/')),
    gulp.src('./src/**/*.js')
      .pipe(babel({
          presets: ['es2015', 'es2016', 'stage-0']
      }))
      .pipe(gulp.dest('./dist'))
  );
});

gulp.task('watch', () => {
  return gulp.watch('./src/**/*', ['default']);
});