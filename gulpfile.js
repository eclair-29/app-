/* ================================================================

 * Gulp System Builder File - at gulpfile.js
 * git repo: https://github.com/eclair-29/gulp

 * ================================================================

 * developer: Miguel A. de Chavez (dmgzky@gmail.com)
 * file version: 1.1.0 -- © 2017 Skuld Project, LLC

 * ================================================================

 * file specs:
 * desc: tasks management for preprocessing files
 * tasks to be preprocess:
 * sass/css files
 * javascript files
 * html markup files
 * browser relaoding
 * error log
 * OPTIONAL: semantic ui builder
 * OPTIONAL: bootstrap
 * OPTIONAL: pho connect server

 * ================================================================

 * system build file: gulpfile.js v.1.1.0
 * tasks name: 'default' tasks

 * ================================================================

 * Building Procedures (MUST READ THIS):
 
 * NOTE: Install UI/CSS Framwworks (Semantic UI/Bootstrap) 
 * via npm first if needed.

 * 1st step: 
 * run 'gulp semantic-build' or 'gulp semantic'
 * NOTE: the 'gulp semantic' comes w/ 'watch' task for semantic, so
 * we recommend to use the command 'gulp semantic-build' instead to only
 * fetch distribution files.

 * 2nd step:
 * after building the dist/ folder from semantic source,
 * run 'gulp semantic-dist' to distribute the dist/ folder from
 * semantic source folder to the project build folder.

 * 3rd step:
 * run 'gulp semantic-clean' to remove the dist/ folder from the
 * semantic source folder (to minimize overall file size).

 * 4th step:
 * finally, run 'gulp' to fetch all tasks (scripts, styles, markups)
 * and watch them all for changes.

 * 5th step: FOR BOOTSTRAP (optional if not using semantic)
 * run 'gulp bs-dist' to distribute the compiled css and js files from
 * node_modules to the build folder

 * 6th step:
 * press and hold 'ctrl + c' to terminate session.
 
 * ADDED TO v.1.1.0:
 * gulp-babel transpiler (es6)
 * gulp-connect-php

 * ================================================================ */







/* ================================================================
 * File Configurations 
 * ================================================================ */

var paths = { 
	javascripts: 'src/scripts/**/*.js',
	sass: 'src/styles/**/*.+(sass|scss)',
	html_files: 'build/*.html',
	php_files: 'build/*.php',
	images: 'build/assets/images/*'
};



/* ================================================================
 * Gulp Requires
 * ================================================================ */

var gulp 		 	= require('gulp');
var sass 		 	= require('gulp-sass');
var babel			= require('gulp-babel'); // <- needs babel-core & babel-preset-env
var uglify  	 	= require('gulp-uglify');
var connect			= require('gulp-connect-php');
var sourcemaps	 	= require('gulp-sourcemaps');
var imagemin	 	= require('gulp-imagemin');
var autoprefixer 	= require('gulp-autoprefixer');
var browsersync	 	= require('browser-sync');
var reload	 	 	= browsersync.reload;

/* semantic build imports (OPTIONAL) */
// var watch  			= require('./semantic/tasks/watch');
// var build  			= require('./semantic/tasks/build');
// var clean  			= require('./semantic/tasks/clean');



/* ================================================================
 * Error Handler
 * ================================================================ */

function errorlog(err) {
	console.log(err.message);
	this.emit('end');
}



/* ================================================================
 * Semantic Build Tasks
 * ================================================================ */

// gulp.task('semantic-watch', watch); // <- watch semantic source for changes
// gulp.task('semantic-build', build); // <- build source files for changes (USE THIS!)
// gulp.task('semantic', ['semantic-watch', 'semantic-build']); // <- semantic default tasks



/* ================================================================
 * Semantic Distribution Tasks
 * copy the dist folder from the semantic source to the build folder
 * ================================================================ */

// gulp.task('semantic-dist',function(){
// 	return gulp.src('semantic/dist/**/*')
// 		.pipe(gulp.dest('build/vendors/semantic'));
// });
// gulp.task('semantic-clean', clean); // <- clean /dist folder from semantic



/* ================================================================
 * Bootstrap Distribution Tasks
 * copy the dist folder from the node_modules/bootstrap source 
 * to the build folder
 * ================================================================ */

// gulp.task('bs-dist',function(){
// 	return gulp.src('node_modules/bootstrap/dist/**/*')
// 		.pipe(gulp.dest('build/vendors/bootstrap'));
// });



/* ================================================================
 * Scripts Tasks
 * ================================================================ */

gulp.task('scripts', function(){
	return gulp.src(paths.javascripts)
		.pipe(sourcemaps.init())
		.pipe(babel({
            presets: ['@babel/env']
        }))
		.pipe(uglify())
		.on('error', errorlog)
		.pipe(sourcemaps.write('../js/maps'))
		.pipe(gulp.dest('build/js'))
		.pipe(reload({stream: true}));
});



/* ================================================================
 * Styles Tasks
 * ================================================================ */

gulp.task('styles', function(){
	return gulp.src(paths.sass)
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}))
		.on('error', errorlog)
		.pipe(autoprefixer({browsers: ['last 3 versions'], cascade: false}))
		.pipe(sourcemaps.write('../css/maps'))
		.pipe(gulp.dest('build/css'))
		.pipe(reload({stream: true}));
});



/* ================================================================
 * HTML Tasks
 * ================================================================ */

gulp.task('html', function(){
	return gulp.src(paths.html_files)
		.pipe(reload({stream: true}));
});



/* ================================================================
 * PHP Tasks
 * ================================================================ */

gulp.task('php', function(){
	return gulp.src(paths.php_files)
		.pipe(reload({stream: true}));
});



/* ================================================================
 * Images Minification Tasks
 * minify images to enhance request loading
 * ================================================================ */

gulp.task('image-min', function(){
	return gulp.src(paths.images)
	.pipe(imagemin())
	.pipe(gulp.dest('build/assets/images'))
});


/* ================================================================
 * Browser Sync Tasks
 * live reload changes
 * ================================================================ */

gulp.task('browser-sync', function(){
	browsersync({
		server: {baseDir: "./build/"}
	});
});



/* ================================================================
 * Connect to a PHP Server Tasks
 * ================================================================ */

gulp.task('connect', function() {
	connect.server({
		hostname: 'localhost',
		base: './build',
		keepalive: true,
	}, function (){
		browsersync.create().init({
			server: {baseDir: "./build/"},
			open: false
		});
	});
});



/* ================================================================
 * Watch Tasks
 * watch all tasks for js, sass, and html files for changes
 * ================================================================ */

gulp.task('watch', function(){
	gulp.watch(paths.javascripts, ['scripts']);
	gulp.watch(paths.sass, ['styles']);
	gulp.watch(paths.html_files, ['html']);
	gulp.watch(paths.php_files, ['php']);
	gulp.watch(paths.images, ['image-min']);
});



/* ================================================================
 * Defautt Tasks
 * ================================================================ */

gulp.task('default', ['scripts', 'styles', 'html', 'connect', 'browser-sync', 'image-min', 'php', 'watch']);
