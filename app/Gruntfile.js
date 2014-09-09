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
	
	var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;
	
	grunt.initConfig({ // Define the configuration for all the tasks

		// Project settings
		yeoman: {
			// configurable paths
			app: require('./bower.json').appPath || 'app',
			dist: 'dist',

		},

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			js: {
				files: [
					'<%= yeoman.app %>/scripts/{,*/}*.js',
					'<%= yeoman.app %>/locales/{,*/}*.json',
					'<%= yeoman.app %>/templates/{,*/}*.html',
				],
				tasks: [
					// 'newer:jshint:all'
				],
				options: {
					livereload: 3333
				}
			},
			jsTest: {
				files: ['test/spec/{,*/}*.js'],
				tasks: [
					// 'newer:jshint:test',
					'karma'
				]
			},
			compass: {
				files: ['<%= yeoman.app %>/{,*/}*.{scss,sass}'],
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
					'.tmp/styles/{,*/}*.css',
					'<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},

		preprocess: {
			options: {
				inline: true,
				context: {
					DEBUG: false
				}
			},
			html: {
				src: '<%= yeoman.dist %>/index.html',
				dest: '<%= yeoman.dist %>/index.html'
			}
		},

		search: {
			templates: {
				files: {
					src: ['<%= yeoman.app %>/templates/*.html']
				},
				options: {
					searchString: /\'([\d\w]+)\'\s*\|\s*translate/g,
					logFile: '.tmp/results.json',
					onMatch: function(match) {
						var translateEn = require('./app/locales/en/messages.json'),
							translateCs = require('./app/locales/cs/messages.json'),
							key = match.match.match(/\'([\d\w]+)\'\s*\|\s*translate/)[1];

						if (!translateEn[key]) {
							grunt.log.error(key + ' is missing in EN');
						}
						if (!translateCs[key]) {
							grunt.log.error(key + ' is missing in CS');
						}
					},
				}
			},
			scripts: {
				files: {
					src: ['<%= yeoman.app %>/scripts/**/*.js']
				},
				options: {
					searchString: /\$translate\(\'(.*)\'\)/g,
					logFile: '.tmp/results.json',
					onMatch: function(match) {
						var translateEn = require('./app/locales/en/messages.json'),
							translateCs = require('./app/locales/cs/messages.json'),
							key = match.match.match(/\$translate\(\'(.*)\'\)/)[1];

						if (!translateEn[key]) {
							grunt.log.error(key + ' is missing in EN ' + match.file + ':' + match.line);
						}
						if (!translateCs[key]) {
							grunt.log.error(key + ' is missing in CS ' + match.file + ':' + match.line);
						}
					},
				}
			}
		},

		ngdocs: {
			options: {
				dest: 'docs',
				html5Mode: true,
				startPage: '/api',
				title: 'Hearth API',
				titleLink: '/api',
				bestMatch: true
			},

			api: {
				src: ['<%= yeoman.app %>/scripts/**/*.js'],
				title: 'Hearth API Documentation'
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				protocol: 'https',
			 	key: grunt.file.read('./cert/server.key').toString(),
				cert: grunt.file.read('./cert/server.crt').toString(),
				ca: grunt.file.read('./cert/ca.crt').toString(),
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost',
				livereload: 3333,
				open: true,
				middleware: function(connect, options) {
					var middlewares = [];

					// RewriteRules support
					middlewares.push(rewriteRulesSnippet);

					if (!Array.isArray(options.base)) {
						options.base = [options.base];
					}

					middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);

					var directory = options.directory || options.base[options.base.length - 1];
					options.base.forEach(function(base) {
						// Serve static files.
						middlewares.push(connect.static(base));
					});

					// Make directory browse-able.
					middlewares.push(connect.directory(directory));

					return middlewares;
				}
			},

			rules: [
				{from: '^/api/(.*)$',to: '/api/$1'},
				{from: '^/app(.*)$',to: '$1'},
				{from: '^(?!app).*',to: '/app/', redirect: 'temporary'},
			],

			proxies: [{
				context: '/api', // the context of the data service
				changeOrigin: true,
				host: process.env.GRUNT_HOST || 'dev.hearth.net',  // wherever the data service is running,
				https: process.env.GRUNT_SSL == null, // true,
				port: process.env.GRUNT_PORT || 443  // the port that the data service is running on
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

						// RewriteRules support
						middlewares.push(rewriteRulesSnippet);

						if (!Array.isArray(options.base)) {
							options.base = [options.base];
						}
	
						middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);

						var directory = options.directory || options.base[options.base.length - 1];
						options.base.forEach(function(base) {
							// Serve static files.
							middlewares.push(connect.static(base));
						});

						// Make directory browse-able.
						middlewares.push(connect.directory(directory));

						return middlewares;
					}
				}
			},
			test: {
				options: {
					port: 9001,
					base: [

						//'.tmp',
						//'tesat',
						//'<%= yeoman.app %>'
					]
				}
			},
			dist: {
				options: {
					base: '<%= yeoman.dist %>',
					middleware: function(connect, options) {
						var middlewares = [];

						// RewriteRules support
						middlewares.push(rewriteRulesSnippet);

						if (!Array.isArray(options.base)) {
							options.base = [options.base];
						}
	
						middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);

						var directory = options.directory || options.base[options.base.length - 1];
						options.base.forEach(function(base) {
							// Serve static files.
							middlewares.push(connect.static(base));
						});

						// Make directory browse-able.
						middlewares.push(connect.directory(directory));

						return middlewares;
					}
				}
			},
			doc: {
				options: {
					port: 9001,
					livereload: 35729,
					base: 'docs',
					keepalive: true
				},
				server: {}
			}

		},

		configureRewriteRules: {
			options: {
				rulesProvider: 'connect.rules'
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish'),
				ignores: [
					'<%= yeoman.app %>/scripts/foundation.topbar.js',
					'<%= yeoman.app %>/scripts/oms.min.js'
				]
			},
			all: [
				'Gruntfile.js',
				'<%= yeoman.app %>/scripts/{,*/}*.js'
			],
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: ['test/spec/{,*/}*.js']
			}
		},

		// Empties folders to start fresh
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

		// Add vendor prefixed styles
		autoprefixer: {
			options: {
				browsers: ['last 2 versions']
			},
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/styles/',
					src: '{,*/}*.css',
					dest: '.tmp/styles/'
				}]
			}
		},
		'bower-install-simple': {
			options: {
				color: true,
				production: false,
				directory: 'app/vendor'
			}
		},

		// Automatically inject Bower components into the app
		'bowerInstall': {
			app: {
				src: '<%= yeoman.app %>/index.html',
				ignorePath: '<%= yeoman.app %>/'
			}
		},

		// Compiles Sass to CSS and generates necessary files if requested
		compass: {
			options: {
				sassDir: '<%= yeoman.app %>/styles',
				cssDir: '.tmp/styles',
				generatedImagesDir: '.tmp/images/generated',
				imagesDir: '<%= yeoman.app %>/images',
				javascriptsDir: '<%= yeoman.app %>/scripts',
				fontsDir: '<%= yeoman.app %>/fonts',
				httpImagesPath: '../images',
				httpGeneratedImagesPath: '/images/generated',
				httpFontsPath: '../fonts',
				relativeAssets: false,
				assetCacheBuster: false,
				bundleExec: true,
				raw: 'Sass::Script::Number.precision = 10\n',
				importPath: [
					'app/vendor/font-awesome/scss/',
					'app/vendor/foundation/scss/'
				]
			},
			dist: {
				options: {
					generatedImagesDir: '<%= yeoman.dist %>/images/generated',
					outputStyle: 'compressed',
					trace: true,
					force: false
				}
			},
			server: {
				options: {}
			}
		},

		// Renames files for browser caching purposes
		rev: {
			dist: {
				files: {
					src: [
						'<%= yeoman.dist %>/scripts/{,*/}*.js',
						'<%= yeoman.dist %>/styles/{,*/}*.css',
						//'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
						//'<%= yeoman.dist %>/styles/fonts/*'
					]
				}
			}
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			html: [
				'<%= yeoman.app %>/app/index.html',
				'<%= yeoman.app %>/index.html'
			],
			options: {
				dest: '<%= yeoman.dist %>'
			}
		},

		// Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			html: ['<%= yeoman.dist %>/{,*/}*.html'],
			css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
			options: {
				assetsDirs: ['<%= yeoman.dist %>']
			}
		},

		// The following *-min tasks produce minified files in the dist folder
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/images',
					src: '{,*/}*.{png,jpg,jpeg,gif}',
					dest: '<%= yeoman.dist %>/images'
				}]
			}
		},
		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.app %>/images',
					src: '{,*/}*.svg',
					dest: '<%= yeoman.dist %>/images'
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
					src: ['*.html', 'views/{,*/}*.html'],
					dest: '<%= yeoman.dist %>'
				}]
			}
		},

		// Allow the use of non-minsafe AngularJS files. Automatically makes it
		// minsafe compatible so Uglify does not destroy the ng references
		ngmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/concat/scripts',
					src: '*.js',
					dest: '.tmp/concat/scripts'
				}]
			}
		},

		// Replace Google CDN references
		cdnify: {
			dist: {
				html: ['<%= yeoman.dist %>/*.html']
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>',
					dest: '<%= yeoman.dist %>',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						'*.html',
						'templates/{,*/}*.html',
						'vendor/**/*',
						'images/{,*/}*.{webp}',
						'fonts/*',
					]
				}, {
					expand: true,
					cwd: '.tmp/images',
					dest: '<%= yeoman.dist %>/images',
					src: ['generated/*']
				}, {
					expand: true,
					cwd: '<%= yeoman.app %>/app',
					dest: '<%= yeoman.dist %>/app',
					src: ['**']
				}, {
					expand: true,
					cwd: '<%= yeoman.app %>/locales',
					dest: '<%= yeoman.dist %>/locales',
					src: ['**']
				}, {
					expand: true,
					cwd: '.tmp/styles',
					dest: '<%= yeoman.dist %>/styles',
					src: ['**']
				}, {
					expand: true,
					dot: true,
					cwd: '<%= yeoman.app %>/vendor/font-awesome/fonts/',
					src: ['*.*'],
					dest: '<%= yeoman.dist %>/fonts'
				}]
			},
			styles: {
				expand: true,
				cwd: '<%= yeoman.app %>/styles',
				dest: '.tmp/styles/',
				src: '{,*/}*.css'
			},
			fonts: {
				expand: true,
				cwd: '<%= yeoman.app %>/vendor/font-awesome/fonts/',
				dest: '.tmp/fonts',
				src: ['*.*']
			}
		},

		// Run some tasks in parallel to speed up the build process
		concurrent: {
			server: [
				'compass:server'
			],
			test: [
				'compass'
			],
			dist: [

				'imagemin',
				'svgmin'
			]
		},

		// By default, your `index.html`'s <!-- Usemin block --> will take care of
		// minification. These next options are pre-configured if you do not wish
		// to use the Usemin blocks.
		cssmin: {
			dist: {
				files: {
					'<%= yeoman.dist %>/styles/main.css': [
						'.tmp\/concat\/styles/{,*/}*.css',
						'<%= yeoman.app %>/styles/{,*/}*.css'
					]
				}
			}
		},
		uglify: {
			dist: {},
			vendor: {
				src: '<%= yeoman.dist %>/scripts/vendor.js',
				dest: '<%= yeoman.dist %>/scripts/vendor.js',
			}
		},
		concat: {
			options: {
				separator: ';',
			},
			dist: {},
			tmpl: {
				src: ['<%= yeoman.dist %>/scripts/templates.js', '<%= yeoman.dist %>/scripts/scripts.js'],
				dest: '<%= yeoman.dist %>/scripts/scripts.js',
			},
			vendor: {
				src: ['<%= yeoman.dist %>/scripts/vendor.js', '<%= yeoman.app %>/vendor/angularitics/src/angulartics-ga.js'],
				dest: '<%= yeoman.dist %>/scripts/vendor.js',
			}
		},

		// Test settings
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				autoWatch: true
			}
		},
		html2js: {
			options: {
				base: '<%= yeoman.dist %>'
			},
			main: {
				// src: ['app/**/*.html'],							 // original source
				src: ['<%= yeoman.dist %>/**/*.html'], // compiled source
				dest: '<%= yeoman.dist %>/scripts/templates.js'
			},
		},

		// Add angular module for merged templates
		replace: {
			dist: {
				src: ['<%= yeoman.dist %>/scripts/scripts.js'],
				overwrite: true,
				replacements: [{
					from: 'module("hearth",["',
					to: 'module("hearth",["templates-main","'
				}]
			}
		},

		cacheBust: {
			options: {
				encoding: 'utf8',
				algorithm: 'md5',
				length: 16
			},
			assets: {
				files: [{
					src: ['<%= yeoman.dist %>/index.html']
				}]
			}
		},
	});

	grunt.registerTask('serve', function(target) {
		if (target === 'dist') {
			return grunt.task.run([
				'build',
				'configureProxies:server',
				'configureRewriteRules',
				'connect:dist:keepalive'
			]);
		}

		grunt.task.run([
			'clean:server',
			'bower-install-simple',
			'bowerInstall',
			'search',
			'copy:fonts',
			'concurrent:server',
			'autoprefixer',
			'configureProxies:server',
			'configureRewriteRules',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('server', function() {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run(['serve']);
	});

	grunt.registerTask('test', [
		'clean:server',
		'concurrent:test',
		'autoprefixer',
		'karma'
	]);

	grunt.registerTask('build', [
		'clean:dist',
		'bower-install-simple',
		'bowerInstall',
		'search',
		'useminPrepare',
		'concurrent:dist',
		'compass:dist',
		'autoprefixer',
		'concat',
		'copy:dist',
		'preprocess',
		'ngmin',
		//'cdnify',
		'cssmin',
		'uglify',
		//'rev',
		'usemin',
		'htmlmin',
		'html2js', //  merge all templates to one js file
		'replace:dist', // add angular module for merged templates
		'concat:tmpl',
		'concat:vendor',
		'uglify:vendor',
		'cacheBust'
	]);

	grunt.registerTask('default', [
		'newer:jshint',
		'test',
		'build'
	]);

	grunt.registerTask('doc', [
		'ngdocs',
		'connect:doc'
	]);

};
