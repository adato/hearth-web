module.exports = function(grunt) {

	var landingPageSrcFolder = 'landing-page-src',
		landingPageDestFolder = 'dist';

	var cssMinFiles = {};
	cssMinFiles[landingPageDestFolder + '/css/main.css'] = [
		landingPageSrcFolder + '/css/components.css',
		landingPageSrcFolder + '/css/hamburger.css',
		landingPageSrcFolder + '/css/dots-navigation.css',
		landingPageSrcFolder + '/css/main.css',
		landingPageSrcFolder + '/css/font-awesome.min.css'
	];

	grunt.initConfig({
		clean: {
			landingPageDestFolderCss: [landingPageDestFolder + '/css'],
			landingPageDestFolderHtml: [landingPageDestFolder + '/**/*.html'],
			landingPageDestFolderJs: [landingPageDestFolder + '/js'],
			landingPageDestFolderFonts: [landingPageDestFolder + '/fonts'],
			landingPageDestFolderImg: [landingPageDestFolder + '/img']
		},
		concat: {
			options: {
				separator: '\n',
			},
			dist: {
    			src: [
					landingPageSrcFolder + '/js/config.js',
					landingPageSrcFolder + '/js/libs.js',
					// landingPageSrcFolder + '/js/language.js',
					landingPageSrcFolder + '/js/testimonials.js',
					landingPageSrcFolder + '/js/referrals.js',
					landingPageSrcFolder + '/js/blogposts.js',
					landingPageSrcFolder + '/js/smooth-scroll.js',
					landingPageSrcFolder + '/js/dots-navigation.js',
					landingPageSrcFolder + '/js/slideshow.js',
					landingPageSrcFolder + '/js/profile.js',
					landingPageSrcFolder + '/js/script.js'
				],
    			dest: landingPageDestFolder + '/js/main.js',
			},
		},
		copy: {
			main: {
				files: [
					{expand: true, cwd: landingPageSrcFolder + '/fonts', src: ['**'], dest: landingPageDestFolder + '/fonts'},
					{expand: true, cwd: landingPageSrcFolder + '/img', src: ['**'], dest: landingPageDestFolder + '/img'}
				]
			}
		},
		cssmin: {
			options: {
				sourcemap: false,
	  			shorthandCompacting: false,
				roundingPrecision: -1
			},
			target: {
	  			files: cssMinFiles
			}
		},
		fetch_locales: {
			locales: {
				options: {
					sourceConfig: 'configuration/development.js',
					sourceUrl: 'https://localise.biz/api/export/locale/{langVal}.json?key=d7296261d74b45268838a561a055ee1c&filter=landing&fallback=cs_CZ',
					destFilepath: 'locales/{langKey}.json',
					parseFunction: function parseDefault(conf) {
						// this will take local config for given environment and parse language codes in format: {cs: cs_CZ, ...}
						return JSON.parse(conf.replace(/[ \t\n]/g, '').match(/languages:(\{.*?\})/)[1]);
					}
				}
			}
		},
		i18n: {
    		dist: {
	    		options: {
			        baseDir: landingPageSrcFolder + '/html',
			        outputDir: landingPageDestFolder,
	        	}
    		},
    		options: {
		        locales: ['en', 'cs', 'sk'],
		        locale: 'en',
		        localesPath: 'locales',
				selector: '[t]',
				allowHtml: true,
				removeAttr: true
    		}
    	}
	});

	grunt.loadNpmTasks('grunt-i18n-static');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-fetch-locales');

	// WARNING - watch out what is being cleaned !!!
	grunt.registerTask('clean', ['clean']);

	// download locales from server
	grunt.registerTask('locales', function(target) {
		grunt.task.run(['fetch_locales']);
	});

	// default build task
	grunt.registerTask('build', ['fetch_locales', 'i18n', 'copy', 'cssmin', 'concat:dist']);

	grunt.registerTask('default', function() {
		grunt.task.run('build');
	});

};