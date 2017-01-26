module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [

      // Load config stuff for the environment
      'test/unit/setup.js',

      // application config
      'dist/app/assets/js/config.js',

      // 'dist/app/assets/js/jquery.js',
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/jquery.cookie/jquery.cookie.js',
      'bower_components/jquery-autosize/jquery.autosize.min.js',
      'app/libs/jquery.mailgun_validator.js',
      'app/libs/jquery.tipsy.js',
      'app/libs/lemmon-slider.js',
      'app/libs/utils/device.js',
      'app/libs/utils/ExifRestorer.js',
      'app/libs/utils/eventPause.js',
      'app/libs/utils/emails.js',
      'app/libs/utils/jqueryQueryParams.js',
      'app/libs/utils/newRelic.js',
      // 'app/libs/utils/tracking.js', <<< this is WRONG .. doesn't allow tests to finish
      'app/libs/utils/oms.min.js',


      'dist/app/assets/js/libs.js',

      // test only deps
      'bower_components/angular-mocks/angular-mocks.js',

      // application JS
      'dist/app/assets/js/app.js',
      'dist/app/assets/templates/templates.js',

      // application tests
      'test/unit/**/*.spec.js',
    ],

    preprocessors: {
      'test/unit/**/*.spec.js': ['babel']
    },

    // babelPreprocessor: {
    //   options: {
    //     presets: ['es2015'],
    //     sourceMap: 'inline'
    //   },
    //   filename: function (file) {
    //     return file.originalPath.replace(/\.js$/, '.es5.js');
    //   },
    //   sourceFileName: function (file) {
    //     return file.originalPath;
    //   }
    // },

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