module.exports = function(grunt) {

	grunt.initConfig({
		clean: {

		},
		copy: {
			
		},
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
		i18n: {
    		dist: {
	    		options: {
			        baseDir: 'app/new-landing-page',
			        outputDir: 'app/nlp',
	        	}
    		},
    		options: {
		        // fileFormat: 'json',
		        // exclude: [],
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
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['clean', 'i18n', 'copy']);

};