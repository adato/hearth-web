var testFolder = './test/';
var HtmlScreenshotReporter = require('/usr/local/lib/node_modules/protractor-jasmine2-screenshot-reporter');

var reporter = new HtmlScreenshotReporter({
  dest: 'target/screenshots',
  filename: 'my-report.html'
});

exports.config = {

	specs: [
		testFolder + 'unauth/marketplace.js',
		testFolder + 'auth/register.js',
		testFolder + 'auth/login.js',
		testFolder + 'auth/bookmarks.js',
		testFolder + 'auth/deleteUser.js'
	],
	suites: {
		'unauth': [testFolder + 'unauth/marketplace.js'],
		'auth': [
			testFolder + 'auth/register.js',
			testFolder + 'auth/login.js',
			testFolder + 'auth/deleteUser.js'
		]
	},

  // Setup the report before any tests start
  beforeLaunch: function() {
    return new Promise(function(resolve){
      reporter.beforeLaunch(resolve);
    });
  },

	onPrepare: function() {
		protractor.helpers = require('./test/setup.js');
    jasmine.getEnv().addReporter(reporter);
	},

  // Close the report after all tests finish
  afterLaunch: function(exitCode) {
    return new Promise(function(resolve){
      reporter.afterLaunch(resolve.bind(this, exitCode));
    });
  },
	params: {
		env: 'local'
	}
};
