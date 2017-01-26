var through = require("through");
var gutil = require("gulp-util");
var staticI18n = require('static-i18n');

module.exports = function(opts) {

	var stream = through(function(file, enc, cb) {
		this.push(file);
		cb && cb();
	});

  var options = {
    selector: '[data-t]',
    useAttr: true,
    replace: false,
    locales: ['en'],
    fixPaths: true,
    locale: 'en',
    files: '**/*.html',
    exclude: [],
    allowHtml: false,
    baseDir: process.cwd(),
    removeAttr: true,
    outputDir: void 0,
    fileFormat: 'json',
    localeFile: '__lng__.__fmt__',
    outputDefault: '__file__',
    outputOther: '__lng__/__file__',
    localesPath: 'locales',
    outputOverride: {},
    encoding: 'utf8',
    i18n: {
      resGetPath: void 0,
      lng: void 0
    }
  };

  for (var prop in options) {
    if (opts.hasOwnProperty(prop)) {
      options[prop] = opts[prop];
    }
  }

  staticI18n.processDir(options.baseDir, options, function(err, res) {
    if (err) {
      gutil.log("Failed to compile: " + err);
      stream.emit('error', 'gulp-node-static-i18n: ' + err);
    }
    stream.queue(res);
    stream.emit('end');
  });

	return stream;

};