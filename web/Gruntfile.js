module.exports = function(grunt) {

	var landingPageSrcFolder = 'landing-page-src',
		landingPageDestFolder = 'app2';

	var cssMinFiles = {};
	cssMinFiles[landingPageDestFolder + '/css/main.css'] = [
		landingPageSrcFolder + '/css/components.css',
		landingPageSrcFolder + '/css/hamburger.css',
		landingPageSrcFolder + '/css/dots.css',
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
				separator: ';',
			},
			dist: {
    			src: [
					landingPageSrcFolder + '/js/smooth-scroll.js',
					landingPageSrcFolder + '/js/dots.js',
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

	// WARNING - watch out what is being cleaned !!!
	grunt.registerTask('clean', ['clean']);

	// default build task
	grunt.registerTask('default', ['i18n', 'copy', 'cssmin', 'concat:dist']);

};