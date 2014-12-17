// Generated on 2014-03-17 using generator-angular 0.7.1
'use strict';
// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt); // Load grunt tasks automatically

	require('time-grunt')(grunt); // Time how long tasks take. Can help when optimizing build times

	grunt.initConfig({ // Define the configuration for all the tasks
		// Project settings
		yeoman: {
			// configurable paths
			app: 'app',
			dist: 'dist'
		},
		// // Watches files for changes and runs tasks based on the changed files
		watch: {
			js: {
				files: ['<%= yeoman.app %>/css/{,*/}*.js'],
				tasks: ['newer:jshint:all'],
				options: {
					livereload: true
				}
			},
			compass: {
				files: ['<%= yeoman.app %>/sass/{,*/}*.{scss,sass}'],
				tasks: ['compass:server', 'autoprefixer']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= yeoman.app %>/{,*/}*.html',
					'.tmp/css/{,*/}*.css',
					'<%= yeoman.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},
		// // The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost',
				livereload: 35729,
				open: true,
				middleware: function(connect, options) {
					var middlewares = [];
					if (!Array.isArray(options.base)) {
						options.base = [options.base];
					}
					// Setup the proxy
					middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);
					// Serve static files
					options.base.forEach(function(base) {
						middlewares.push(connect.static(base));
					});
					return middlewares;
				}
			},
			proxies: [{
				context: '/api', // the context of the data service
				changeOrigin: true,
				host: 'dev.hearth.net', // wherever the data service is running,
				https: false,
				port: 80 // the port that the data service is running on
			}],
			livereload: {
				options: {
					open: true,
					base: [
						'.tmp',
						'<%= yeoman.app %>'
					],
					middleware: function(connect, options) {
						var middlewares = [];
						if (!Array.isArray(options.base)) {
							options.base = [options.base];
						}
						// Setup the proxy
						middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);
						// Serve static files
						options.base.forEach(function(base) {
							middlewares.push(connect.static(base));
						});
						return middlewares;
					}
				}
			},
			dist: {
				options: {
					base: '<%= yeoman.dist %>'
				}
			}
		},
		// // Make sure code styles are up to par and there are no obvious mistakes
		// jshint: {
		// 	options: {
		// 		jshintrc: '.jshintrc',
		// 		reporter: require('jshint-stylish')
		// 	},
		// 	all: [
		// 		'Gruntfile.js',
		// 		'<%= yeoman.app %>/scripts/{,*/}*.js'
		// 	],
		// 	test: {
		// 		options: {
		// 			jshintrc: 'test/.jshintrc'
		// 		},
		// 		src: ['test/spec/{,*/}*.js']
		// 	}
		// },
		// // Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= yeoman.dist %>/*',
						'!<%= yeoman.dist %>/.git*'
					]
				}]
			},
			server: '.tmp'
		},
		// // Add vendor prefixed styles
		autoprefixer: {
			options: {
				browsers: ['last 2 versions']
			},
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/css/',
					src: '{,*/}*.css',
					dest: '.tmp/css/'
				}]
			}
		},
		// // Compiles Sass to CSS and generates necessary files if requested
		compass: {
			options: {
				sassDir: '<%= yeoman.app %>/sass',
				cssDir: '.tmp/css',
				generatedImagesDir: '.tmp/img/',
				imagesDir: '<%= yeoman.app %>/img',
				javascriptsDir: '<%= yeoman.app %>/js',
				fontsDir: '<%= yeoman.app %>/fonts',
				httpImagesPath: '/img/',
				httpGeneratedImagesPath: '/img/',
				httpFontsPath: '/fonts',
				relativeAssets: false,
				assetCacheBuster: false,
				raw: 'Sass::Script::Number.precision = 10\n',
			},
			dist: {
				options: {
					generatedImagesDir: '<%= yeoman.dist %>/img',
					httpImagesPath: '../img',
					httpGeneratedImagesPath: 'img',
					httpFontsPath: 'fonts',
					trace: true,
					force: false
				}
			},
			server: {
				options: {}
			}
		},
		// // Renames files for browser caching purposes
		rev: {
			dist: {
				files: {
					src: [
						'<%= yeoman.dist %>/{,*/}*.js',
						'<%= yeoman.dist %>/{,*/}*.css'
					]
				}
			}
		},
		// // Reads HTML for usemin blocks to enable smart builds that automatically
		// // concat, minify and revision files. Creates configurations in memory so
		// // additional tasks can operate on them
		useminPrepare: {
			html: [
				'<%= yeoman.app %>/*.html'
			],
			options: {
				dest: '<%= yeoman.dist %>'
			}
		},
		// // Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			html: ['<%= yeoman.dist %>/{,*/}*.html'],
			css: ['<%= yeoman.dist %>/css/{,*/}*.css'],
			options: {
				assetsDirs: ['<%= yeoman.dist %>']
			}
		},
		// // The following *-min tasks produce minified files in the dist folder
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/img',
					src: '{,*/}*.{png,jpg,jpeg,gif}',
					dest: '<%= yeoman.dist %>/img'
				}]
			}
		},
		htmlmin: {
			dist: {
				options: {
					collapseWhitespace: true,
					collapseBooleanAttributes: true,
					removeCommentsFromCDATA: true,
					removeOptionalTags: true
				},
				files: [{
					expand: true,
					cwd: '<%= yeoman.dist %>',
					src: ['*.html'],
					dest: '<%= yeoman.dist %>'
				}]
			}
		},
		// // Allow the use of non-minsafe AngularJS files. Automatically makes it
		// // minsafe compatible so Uglify does not destroy the ng references
		ngmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/concat',
					src: '*.js',
					dest: '.tmp/concat'
				}]
			}
		},
		// // Replace Google CDN references
		// cdnify: {
		// 	dist: {
		// 		html: ['<%= yeoman.dist %>/*.html']
		// 	}
		// },
		// // Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.dist %>',
					src: [
						'*.{ico,txt}',
						'*.html',
						'img/{,*/}*',
						'fonts/*',
						'pics/{,*/}*',
						'vendor/{,*/}*',
					]
				}, {
					expand: true,
					cwd: '.tmp/img',
					dest: '<%= yeoman.dist %>/img',
					src: ['generated/*']
				}]
			},
			styles: {
				expand: true,
				cwd: '<%= yeoman.app %>/css',
				dest: '.tmp/css/',
				src: '{,*/}*.css'
			}
		},
		// // Run some tasks in parallel to speed up the build process
		concurrent: {
			server: [
				'compass:server'
			],
			test: [
				'compass'
			],
			dist: [
				'imagemin'
			]
		},
		// By default, your `index.html`'s <!-- Usemin block --> will take care of
		// minification. These next options are pre-configured if you do not wish
		// to use the Usemin blocks.
		cssmin: {
			dist: {
				files: {
					'<%= yeoman.dist %>/css/style.css': ['.tmp/css/style.css']
				}
			},
			ie: {
				files: {
					'<%= yeoman.dist %>/css/ie.css': ['.tmp/css/ie.css']
				}
			}
		},
		uglify: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/js',
					src: '**/*.js',
					dest: '<%= yeoman.dist %>/js',
				}]
			},
			distMerge: {
				files: {
					"<%= yeoman.dist %>/js/app.min.js": ["<%= yeoman.dist %>/js/plugins.js", "<%= yeoman.dist %>/js/script.js"]
				}
			}
		},
		concat: {
			dist: {}
		}
	});

	grunt.registerTask('serve', function(target) {
		if (target === 'dist') {
			return grunt.task.run([
				'build',
				// 'configureProxies:server',
				'connect:dist:keepalive'
			]);
		}

		grunt.task.run([
			'clean:server',
			'concurrent:server',
			'autoprefixer',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('server', function() {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run(['serve']);
	});

	grunt.registerTask('build', [
		'clean:dist',
		'useminPrepare',
		'concurrent:dist',
		'compass:dist',
		'autoprefixer',
		'concat',
		'ngmin',
		'copy:dist',
		'cssmin',
		'uglify',
		// 'rev',
		'usemin',
		// 'htmlmin'
	]);
	grunt.registerTask('default', [
		'newer:jshint',
		'test',
		'build'
	]);
};
