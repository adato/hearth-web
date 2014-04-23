// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
	config.set({
		// base path, that will be used to resolve files and exclude
		basePath: 'app',

		// testing framework to use (jasmine/mocha/qunit/...)
		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [
			'vendor/angular/angular.js',
			'vendor/angular-mocks/angular-mocks.js',
			'vendor/angular-resource/angular-resource.js',
			'vendor/angular-cookies/angular-cookies.js',
			'vendor/angular-sanitize/angular-sanitize.js',
			'vendor/angular-route/angular-route.js',
			'scripts/config.js',
			'scripts/controllers/controllers.js',
			'scripts/services/services.js',
			'scripts/directives/directives.js',
			'scripts/*.js',
			'scripts/**/*.js',
			'templates/*.html',
			'test/mock/**/*.js',
			'test/spec/**/*.js'
		],

		preprocessors: {
			'templates/**/*.html': 'html2js'
		},

		// list of files / patterns to exclude
		exclude: [],

		// web server port
		port: 8080,

		// level of logging
		// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['Chrome', 'IE'],

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: false,

		plugins: [
			//'karma-junit-reporter',
      'karma-ng-html2js-preprocessor',
      'karma-chrome-launcher',
      //'karma-firefox-launcher',
      //'karma-opera-launcher',
      'karma-ie-launcher',
			'karma-jasmine'
		],
	});
};