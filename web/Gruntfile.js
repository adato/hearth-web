module.exports = function(grunt) {

	grunt.initConfig({
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

	grunt.registerTask('default', ['i18n']);

};