var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var babel  = require('gulp-babel');

gulp.task('styles', function() {
	gulp.src('scss/**/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(concat('styles.min.css'))
		.pipe(gulp.dest('.'))
});

gulp.task('scripts', function() {
	function createErrorHandler(name) {
		return function (err) {
			console.error('Error from ' + name + ' in scripts task', err.toString());
		};
	}
	return gulp.src(['js/*.js'])
		.pipe(babel({presets: ['env']}))
		.pipe(uglify())
		.on('error', createErrorHandler('uglify'))
		.pipe(concat('scripts.min.js'))
		.on('error', createErrorHandler('concat'))
		.pipe(gulp.dest('.'));
});

gulp.task('watch',function() {
	gulp.watch('scss/**/*.scss',['styles']);
	gulp.watch('js/**/*.js',['scripts']);
});

gulp.task('default', ['watch', 'scripts', 'styles']);
