var gulp = require('gulp');
const babel = require('gulp-babel');
const es = require('event-stream');
const eslint = require('gulp-eslint');
const friendlyFormatter = require("eslint-friendly-formatter");


gulp.task('default', () => {
  return es.concat(
    gulp.src('./package.json')
      .pipe(gulp.dest('./dist/')),
    gulp.src('./src/data/**/*')
      .pipe(gulp.dest('./dist/data/')),
    gulp.src('./src/**/*.js')
      .pipe(eslint())
      .pipe(eslint.format(friendlyFormatter))
      .pipe(babel({
          presets: ['es2015', 'es2016', 'stage-0']
      }))
      .pipe(gulp.dest('./dist'))
  );
});

gulp.task('watch', () => {
  return gulp.watch('./src/**/*', ['default']);
});