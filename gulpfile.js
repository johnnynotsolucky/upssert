var gulp = require('gulp');
const babel = require('gulp-babel');
const es = require('event-stream');
const eslint = require('gulp-eslint');
const friendlyFormatter = require("eslint-friendly-formatter");


gulp.task('default', ['lint'], () => {
  return es.concat(
    gulp.src('./package.json')
      .pipe(gulp.dest('./dist/')),
    gulp.src('./src/data/**/*')
      .pipe(gulp.dest('./dist/data/')),
    gulp.src('./src/**/*.js')
      .pipe(babel({
          presets: ['es2015', 'es2016', 'stage-0']
      }))
      .pipe(gulp.dest('./dist'))
  );
});

gulp.task('lint', (cb) => {
  return es.concat(
    gulp.src('./src/**/*.js')
      .pipe(eslint())
      .pipe(eslint.format()),
    gulp.src('./test/**/*.js')
      .pipe(eslint())
      .pipe(eslint.format(friendlyFormatter))
  );
});

gulp.task('watch', () => {
  return gulp.watch('./src/**/*', ['default']);
});