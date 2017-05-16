var testFolder = './test/e2e/';
exports.config = {
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  allScriptsTimeout: 60000,
  getPageTimeout: 60000,
  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      args: ['--no-sandbox']
    }
  },


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
    ],
    'quick': [
      testFolder + 'auth/login-hardcoded.spec.js',
      testFolder + 'auth/market-reportAbusivePost.spec.js'
    ]
  },

  onPrepare: function () {
    protractor.helpers = require('./test/e2e/setup.js');
    var SpecReporter = require('jasmine-spec-reporter');
    // add jasmine spec reporter
    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
  },

  params: {
    env: 'local'
  }
};
