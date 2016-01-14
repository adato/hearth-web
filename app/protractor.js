var testFolder = './test/';
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  capabilities: {
    'browserName': 'chrome' // or 'firefox', 'safari'
  },
  // specs: [testFolder+'auth/register.js'],
  specs: [
  	testFolder+'auth/register.js', 
  	testFolder+'auth/login.js', 
  	testFolder+'auth/deleteUser.js'
	],
  suites: {
    'unauth': [testFolder+'unauth/marketplace.js'],
    // 'login': [testFolder+'public-login.js'],
    // 'various': [testFolder+'public-various.js'],
    'register': [testFolder+'auth/register.js'],

    // 'various': [testFolder+'logged-various.js'],
    // 'logged': [testFolder+'logged-profile.js'],
  },
  onPrepare: function () {
    protractor.helpers = require('./test/setup.js');
  },
  params: {
    env: 'local'
  },
};
