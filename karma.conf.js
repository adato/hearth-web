module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // deps
      // 'node_modules/karma-read-json/karma-read-json.js',

      // Load config stuff for the environment
      // 'app/test/unit/setup.js',

      // application JS
      'dist/app/assets/js/config.js',
      // 'dist/app/assets/js/jquery.js',
      // 'dist/app/assets/js/libs.js',
      // 'dist/app/assets/js/app.js',

      // application HTML
      // 'dist/app/assets/templates/templates.js',

      'app/test/unit/karma-test-example.spec.js',

      // application tests
      // 'app/test/unit/assets/services/ConversationAux.spec.js', // << temp debug
      // 'app/test/unit/**/*.spec.js',

      // load JSONs
      // {pattern: 'app/assets/locales/**/*.json', included: false},
    ],

    proxies: {
      // return fake file from the running container, version.txt is not available
      '/version.txt': 'http://localhost:9876'
    },

    // list of files to exclude
    exclude: [],

    // possible values: 'spec', 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'junit'],

    junitReporter: {
      outputDir: 'test', // results will be saved as $outputDir/$browserName.xml
      outputFile: 'unit-tests-result.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
      useBrowserName: false // add browser name to report and classes names
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],
    // browsers: ['Chrome'],

    browserNoActivityTimeout: 100000,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};

// Karma configuration
