var testFolder = './test/e2e/';
var HtmlScreenshotReporter = require('/usr/local/lib/node_modules/protractor-jasmine2-screenshot-reporter');
var SpecReporter = require('jasmine-spec-reporter');

var reporter = new HtmlScreenshotReporter({
  dest: 'target/screenshots',
  filename: 'my-report.html'
});

exports.config = {
  directConnect: true,
	specs: [
		testFolder + 'unauth/marketplace.spec.js',
		// testFolder + 'auth/register.spec.js',
		testFolder + 'auth/login.spec.js',
		testFolder + 'auth/profile.spec.js',
		testFolder + 'auth/bookmarks.spec.js',
		testFolder + 'auth/market-reportAbusivePost.spec.js',
		testFolder + 'auth/deleteUser.spec.js'
	],
	suites: {
		'unauth': [testFolder + 'unauth/marketplace.spec.js'],
		'auth': [
			testFolder + 'auth/register.spec.js',
			testFolder + 'auth/login.spec.js',
			testFolder + 'auth/deleteUser.spec.js'
		]
	},

  // Setup the report before any tests start
  beforeLaunch: function() {
    return new Promise(function(resolve){
      reporter.beforeLaunch(resolve);
    });
  },

	onPrepare: function() {
		protractor.helpers = require('./test/e2e/setup.js');
    jasmine.getEnv().addReporter(reporter);
    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
	},

  // Close the report after all tests finish
  afterLaunch: function(exitCode) {
    return new Promise(function(resolve){
      reporter.afterLaunch(resolve.bind(this, exitCode));
    });
  },
	params: {
		env: 'jenkins'
	}
};
