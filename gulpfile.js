// Include Gulp
var gulp = require('gulp');

// Include plugins
var plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
	replaceString: /\bgulp[\-.]/
});

// Define default destination folder
var browserSync = require('browser-sync').create();
var mainBowerFiles = require('gulp-main-bower-files');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
/*
<iframe src="app/" width="800px" height="600px" style="border:2px solid grey;"></iframe>
*/
var paths = {
	source: "angular-test/",
	index: "angular-test/index.html",
	scripts:{
		src: "angular-test/*.js",
		dest: "dist"
	}
}

var options = require('./package.json')

// require('gulp-stats')(gulp);

function serve(done) {
	browserSync.init({
			proxy: "https://www.w3schools.com",
			startPath: "/html/html_iframe.asp",
			logPrefix: options.name,
			serveStatic: [{
				route: 'html/app',
				dir: './dist',
			},
			{
				route: 'images',
				dir: './images',
			}],
			watchOptions: {
				// ignoreInitial: true,
				ignored: '*.txt'
			},
			reloadDebounce: 100,
			open: false,
			files: ['./dist','./images'], // patrones de ficheros a actualizar
			snippetOptions: {

					// Ignore the iframe container
					ignorePaths: "html/tryit.asp",

					// Busco un body que este precedido de un ng-app.
					rule: {
							match: /ng-app[\s\S]*<\/body>/im,
							fn: function (snippet, match) {
									return match.replace(/<\/body>/, snippet + "</body>");
							}
					}
			}
	});
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}
var watchScript = function () {
	return gulp.watch(paths.scripts.src, gulp.series(scripts, reload))
}
var watchIndex = function () {
	return gulp.watch(paths.index, gulp.series(index, reload))
}

function scripts() {
  return gulp.src(paths.scripts.src)
		.pipe(plugins.print())
		.pipe(plugins.sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(plugins.angularFilesort())
		.pipe(plugins.concat('scripts.js'))
		.pipe(plugins.uglify())
		.pipe(plugins.sourcemaps.write())
		.pipe(plugins.print())
    .pipe(gulp.dest(paths.scripts.dest));
}
gulp.task('scripts', scripts);

function index() {
	return gulp.src(paths.index)
		.pipe(plugins.print())
		.pipe(plugins.htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest(paths.scripts.dest));
}
gulp.task('index', index);

// Concatena todos los scripts de dependencias de bower
var vendor =  function(){
	return gulp.src('./bower.json')
	.pipe(mainBowerFiles())
	.pipe(plugins.filter('**/*.js'))
	.pipe(plugins.angularFilesort())
	.pipe(plugins.print())
	.pipe(plugins.sourcemaps.init({loadMaps: true}))
	// .pipe(plugins.uglify())
	.pipe(plugins.concat('vendor.js'))
	.pipe(plugins.print())
	.pipe(plugins.sourcemaps.write())
	.pipe(gulp.dest(paths.scripts.dest));
};
gulp.task('develop', gulp.series(gulp.parallel(scripts, index, vendor, serve), gulp.parallel(watchScript, watchIndex) ));

gulp.task('css', function() {

	var cssFiles = ['src/css/*'];

	return gulp.src(plugins.mainBowerFiles())
		.pipe(plugins.filter('*.css'))
		.pipe(plugins.concat('main.css'))
		.pipe(plugins.uglify())
		.pipe(gulp.dest(dest + 'css'));

});
