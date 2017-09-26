/* =================================================

 * Gulp System Builder File - at gulpfile.js
 * git repo: https://github.com/eclair-29/app 

 * =================================================

 * developer: Miguel A. de Chavez (dmgzky@gmail.com)
 * file version: 1.0.0 -- © 2017 Skuld Project, LLC

 * ================================================= 
 
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

 * =================================================

 * system build file: gulpfile.js v.1.0.0
 * tasks name: 'default' tasks

 * ================================================= */







// ==========================
// File Configurations
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
// Requires
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


// ==========================
// Error Log 
// ==========================

function errorlog(err) {
	console.log(err.message);
	this.emit('end');
}


// ==========================
// Scripts Tasks (=> app.js)
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
// Styles Tasks (sass to css)
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
// HTML Markup Task
// ==========================

gulp.task('html', function(){
	return gulp.src('build/**/*.html')
	.pipe(reload({stream: true}));
});


// ==========================
// Image Minification Task
// ==========================

// minify images to enhance request loading
gulp.task('image:min', function(){
	return gulp.src('build/images/*')
	.pipe(imagemin());
});


// ==========================
// Browser Sync Task
// ==========================

// live reload changes
gulp.task('browser-sync', function(){
	browsersync({
		server: {baseDir: "./build/"}
	});
});


// ==========================
// Semantic Dist Copy Task
// ==========================

// copy the dist folder from the bower/semantic source to the build folder
gulp.task('semantic-build',function(){
	return gulp.src('src/bower/semantic/dist/**/*')
	.pipe(gulp.dest('build/semantic'));
});


// ==========================
// Watch Task
// ==========================

// watch all tasks for js, sass, and html files for changes 
gulp.task('watch', function(){
	gulp.watch('src/js/**/*.js', ['scripts']);
	gulp.watch('src/sass/**/*.+(sass|scss)', ['styles']);
	gulp.watch('build/**/*.html', ['html']);
});


// ==========================
// Default Tasks
// ==========================

gulp.task('default', ['scripts', 'styles', 'html', 'browser-sync', 'image:min', 'semantic-build', 'watch']);

