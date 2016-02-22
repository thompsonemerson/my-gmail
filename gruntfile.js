module.exports = function ( grunt ) {
	'use strict';

	grunt
		// Project configuration
		.initConfig({

			// TASK
			// ================================================================

			// Get metadata to package.json
			pkg: grunt.file.readJSON( 'package.json' ),


			// Watch files and process the above tasks
			watch: {
				options: {
					livereload: true,
				},
				html: {
					files: [ 'src/**/*.html' ],
					tasks: [ 'copy:html' ],
				},
				css: {
					files: [ 'src/css/**/*.sass' ],
					tasks: [ 'sass', 'autoprefixer', 'csslint' ],
				},
				main: {
					files: [ 'src/js/**/*.js' ],
					tasks: [ 'newer:jshint', 'newer:uglify:main' ],
				},
				img: {
					files: [ 'src/img/**/*.{gif,jpg,png,svg}' ],
					tasks: [ 'newer:imagemin' ],
				},
				font: {
					files: [ 'src/font/**/*' ],
					tasks: [ 'copy:font' ],
				},
				lib: {
					files: [ 'src/lib/**/*' ],
					tasks: [ 'copy:lib' ],
				},
			},


			// Copy resources files
			copy: {
				font: {
					files: [{
						expand: true,
						cwd: 'src/font',
						src: [ '**' ],
						dest: 'www/font',
					}],
				},
				lib: {
					files: [{
						expand: true,
						cwd: 'src/lib',
						src: [ '**' ],
						dest: 'www/lib',
					}],
				},
				html: {
					files: [{
						expand: true,
						cwd: 'src',
						src: [ '*', '!*/**' ],
						dest: 'www',
					}],
				}
			},


			// Clear files and folders
			clean: {
				all: [ 'www' ],
			},


			// browserSync
			browserSync: {
				all: {
					bsFiles: {
						src: 'www/**/*',
					},
					options: {
						watchTask: true,
						server: 'www',
					},
				},
			},


			// Lint CSS files
			csslint: {
				all: {
					options: {
						csslintrc: '.csslintrc',
					},
					src: 'www/css/*.css',
				},
			},


			// Process the sass file to css
			sass: {
				all: {
					options: {
						style: 'compressed',
						noCache: true,
					},
					files: {
						'www/css/app.min.css': [ 'src/css/**/*.sass', '!src/css/**/_*.sass' ],
					},
				},
			},


			// Parse CSS and add vendor-prefixed CSS properties using the Can I Use database.
			autoprefixer: {
				all: {
					options: {
						browsers: [ 'last 2 versions', 'ie 8', 'ie 9' ],
						map: true,
					},
					files: {
						'www/css/app.min.css': [ 'www/css/app.min.css' ]
					},
				},
			},


			// Validate files with JShint
			jshint: {
				all: {
					options: {
						jshintrc: '.jshintrc',
					},
					files: {
						src: [ 'src/js/app.js' ],
					},
				},
			},


			// Take all the js files and minify them into js
			uglify: {
				main: {
					options: {},
					files: {
						'www/js/main.min.js': [ 'src/js/**/*.js' ],
					},
				}
			},


			// Minify PNG and JPEG images
			imagemin: {
				all: {
					options: {
						optimizationsLevel: 7,
						progressive: true,
					},
					files: [{
						expand: true,
						cwd: 'src/img',
						src: [ '**/*.{gif,jpg,png,svg}' ],
						dest: 'www/img',
					}],
				},
			},

		});



	// REGISTER TASKS
	// ================================================================

	grunt
		// Default task
		.registerTask( 'default', [
			'build',
			'browserSync',
			'watch'
		])

		// Build task
		.registerTask( 'build', [
			'clean',
			'copy',
			'sass',
			'autoprefixer',
			'uglify',
			'imagemin'
		]);



	// LOAD TASKS
	// ================================================================

	grunt.loadNpmTasks( 'main-bower-files' );

	// Automatically loading Grunt tasks
	require( 'load-grunt-tasks' )( grunt );

	// Display the elapsed execution time of grunt tasks
	require( 'time-grunt' )( grunt );

};
