/* ================================================================

 * Gulp System Builder File - at gulpfile.js
 * git repo: https://github.com/eclair-29/app 

 * ================================================================

 * developer: Miguel A. de Chavez (dmgzky@gmail.com)
 * file version: 1.0.0 -- © 2017 Skuld Project, LLC

 * ================================================================ 
 
 * file specs: 
 * desc: tasks management for preprocessing files
 * tasks to be preprocess: 
 * sass files
 * javascript files
 * html markup files
 * images (metadata)
 * browser relaoding
 * error log 
 * semantic ui builder

 * ================================================================

 * system build file: gulpfile.js v.1.0.0
 * tasks name: 'default' tasks

 * ================================================================

 * Building Procedures (MUST READ THIS): 

 * 1st step:
 * run 'gulp semantic-build' or 'gulp semantic'
 * Note: the 'gulp semantic' comes w/ 'watch' task for semantic, so
 * we recommend to use the command 'gulp semantic-build' to only
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

 * 5th step: 
 * press and hold 'ctrl + c' to terminate session.

 * ================================================================ */







// ==========================
//    File Configurations
// ==========================

var fileConfig = { jsConcatFiles: [

	/* =============================================== 

	 * bower dependency files: 
	 * note: must include bower jquery first! 
	 * component versions: 
	 * jquery v.3.2.1
	 * angular.js v.1.6.5
	 * backbone.js v.1.3.3 (wishlist)

	 * =============================================== */

		'src/bower/jquery/dist/jquery.js',
		'src/bower/angular/angular.js',

	/* =============================================== 

	 * bootstrap-sass javascript file: 
	 * require this file to use bootstrap js components
	 * component version: 
	 * bootstrap-sass v.3.3.7

	 * =============================================== */

		'src/utilities/bootstrap/javascripts/bootstrap.js',

	// main javascript files (project specsfic): 
		'src/js/**/*.js'
	]
}


// ==========================
//         Requires
// ==========================

/* =============================================== 

 * npm modules: gulp dependecies
 * require this files to preprocess tasks
 * module versiona & desc: 
 * gulp (gulp.js) 		v.3.9.1		:main gulp.js 
 * gulp-sass 			v.3.1.0		:sass compiler
 * gulp-concat 			v.2.6.1		:concat all files in one single file (app.js)
 * gulp-uglify 			v.3.0.0		:minify javascripts or css files
 * gulp-sourcemaps 		v.2.6.0		:create .map file in a specific dest.
 * gulp-imagemin 		v.3.3.0		:minify images (metadata) for fast rendering
 * gulp-autoprefixer 	v.4.0.0		:autoprefix styles properties 
 * browser-sync 		v.2.18.13	:live realoding of browsers in sync

 * =============================================== */

var gulp 		 	= require('gulp');					
var sass 		 	= require('gulp-sass');   			
var uglify  	 	= require('gulp-uglify'); 			
var concat		 	= require('gulp-concat');			
var sourcemaps	 	= require('gulp-sourcemaps');		
var imagemin	 	= require('gulp-imagemin');		
var autoprefixer 	= require('gulp-autoprefixer');	
var browsersync	 	= require('browser-sync');
var reload	 	 	= browsersync.reload;
// semantic build imports
var watch  			= require('./semantic/tasks/watch');
var build  			= require('./semantic/tasks/build');
var clean  			= require('./semantic/tasks/clean');


// ==========================
//        Error Log 
// ==========================

function errorlog(err) {
	console.log(err.message);
	this.emit('end');
}


// ==========================
//    Semantic Build Tasks
// ==========================

// watch semantic source for changes
gulp.task('semantic-watch', watch);

// build source files for changes
gulp.task('semantic-build', build);

// semantic default tasks
gulp.task('semantic', ['semantic-watch', 'semantic-build']);


// ==========================
// 	  Semantic Dist Tasks
// ==========================

// copy the dist folder from the semantic source to the build folder
gulp.task('semantic-dist',function(){
	return gulp.src('semantic/dist/**/*')
	.pipe(gulp.dest('build/semantic'));
});

// clean /dist folder from semantic
gulp.task('semantic-clean', clean);


// ==========================
//       Scripts Task
// ==========================

gulp.task('scripts', function(){
	return gulp.src(fileConfig.jsConcatFiles)

		.pipe(sourcemaps.init())
		.pipe(concat('app.js'))
		.pipe(uglify())
		.on('error', errorlog)
		.pipe(sourcemaps.write('../js/maps'))
		.pipe(gulp.dest('build/js'))

		.pipe(reload({stream: true}));
});


// ==========================
//        Styles Task
// ==========================

gulp.task('styles', function(){
	return gulp.src('src/sass/**/*.+(sass|scss)')

		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}))
		.on('error', errorlog)
		.pipe(autoprefixer({browsers: ['last 3 versions'], cascade: false}))
		.pipe(sourcemaps.write('../css/maps'))
		.pipe(gulp.dest('build/css'))
	
		.pipe(reload({stream: true}));
});


// ==========================
//      HTML Markup Task
// ==========================

gulp.task('html', function(){
	return gulp.src('build/**/*.html')
	.pipe(reload({stream: true}));
});


// ==========================
//  Image Minification Task
// ==========================

// minify images to enhance request loading
gulp.task('image:min', function(){
	return gulp.src('build/images/*')
	.pipe(imagemin());
});


// ==========================
//     Browser Sync Task
// ==========================

// live reload changes
gulp.task('browser-sync', function(){
	browsersync({
		server: {baseDir: "./build/"}
	});
});


// ==========================
//        Watch Task
// ==========================

// watch all tasks for js, sass, and html files for changes 
gulp.task('watch', function(){
	gulp.watch('src/js/**/*.js', ['scripts']);
	gulp.watch('src/sass/**/*.+(sass|scss)', ['styles']);
	gulp.watch('build/**/*.html', ['html']);
});


// ==========================
//       Default Tasks
// ==========================

gulp.task('default', ['scripts', 'styles', 'html', 'browser-sync', 'image:min', 'watch']);
