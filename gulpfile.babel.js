'use strict';

import plugins  from 'gulp-load-plugins';
import yargs    from 'yargs';
import browser  from 'browser-sync';
import gulp     from 'gulp';
import rimraf   from 'rimraf';
import yaml     from 'js-yaml';
import fs       from 'fs';

const i18nStatic = require('./hearth_modules/gulp-node-static-i18n');

// for whichever FRICKIN' reason, the gulp-download module (https://github.com/Metrime/gulp-download/blob/master/index.js)
// when downloaded through npm, results in a slightly different code than what can be found on git, so it has been downloaded
const download = require('./hearth_modules/download');

// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --reload flag
// Causes browser reload on file changes
const BROWSER_RELOAD = !!(yargs.argv.reload);

const LOCAL_ENV = 'localhost'
const DEV_ENV = 'development';
const STAGE_ENV = 'staging';
const PROD_ENV = 'production';

const DEFAULT_ENVIRONMENT = LOCAL_ENV;

const ENVIRONMENT = yargs.argv.target || DEFAULT_ENVIRONMENT;

const HOST = yargs.argv.host || null;

// Load settings from settings.yml
const { COMPATIBILITY, PORT, UNCSS_OPTIONS, PATHS, LOCALE } = loadConfig();

function loadConfig() {
  let ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}

// Build app
gulp.task('app',
  gulp.parallel(
    localesApp, // download locales
    templates,  // concat templates
    sass,       // create css
    configs,    // concat configs
    javascript, // concat [+uglify] js
    images,     // minify images
    copyFonts,  // copy font files
    copyRoot,   // copy other assets that don't undergo any processing
    appLibsJs,  // concat external libs js that go to bottom of <body />
    jQuery,     // concat external libs js that go to <head />
    appLibsCss  // concat external libs css
  )
);

// Build landing page
gulp.task('landingPage',
  gulp.series(
    localesLanding,
    gulp.parallel(
      templatesLanding,
      javascriptLanding,
      sassLanding,
      copyFontsLanding,
      imagesLanding
    )
  )
);

// Build the "dist" folder by running all of the below tasks
gulp.task('build',
  gulp.series(
    clean,
    gulp.parallel(
      'app',
      'landingPage',
      copyCommonRoot
    )
  )
);

// Just run the server
gulp.task('server',
  gulp.series(server)
);

// Just run the server and watch w/o building anything
gulp.task('dev',
  gulp.series(server, watch)
);

// Build the site, landing page, run the server, and watch for file changes
gulp.task('default',
  gulp.series('build', server, watch)
);

gulp.task('sass',
  gulp.series(sass)
);

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
  rimraf(PATHS.dist, done);
}

/////////////////////
//
// JAVASCRIPTS

// App js
// Combine JavaScript into one file
// In production, the file is minified
function javascript() {
  return gulp.src(PATHS.src.app.js, PATHS.javascript)
    .pipe($.sourcemaps.init())
    .pipe($.babel({ignore: ['what-input.js']}))
    .pipe($.concat('app.js'))
    .pipe($.if((ENVIRONMENT === PROD_ENV || ENVIRONMENT === STAGE_ENV), $.uglify()
      .on('error', e => { console.log(e); })
    ))
    .pipe($.if(!ENVIRONMENT === PROD_ENV, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/app/assets/js'));
}

function javascriptLanding() {
  // return gulp.src([PATHS.src.configs.landing[ENVIRONMENT]], PATHS.src.landing.js)
  var paths = PATHS.src.landing.js;
  paths.unshift(PATHS.src.configs.landing[ENVIRONMENT]);
  return gulp.src(paths)
    .pipe($.babel())
    .pipe($.concat('main.js'))
    .pipe(gulp.dest(PATHS.dist + '/js'))
}

/////////////////////
//
// CSS

// App compile Sass into CSS, In production, the CSS is compressed
function sass() {
  return gulp.src('app/styles/app.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: PATHS.sass
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: COMPATIBILITY
    }))
    // Comment in the pipe below to run UnCSS in production
    //.pipe($.if(ENVIRONMENT === PROD_ENV, $.uncss(UNCSS_OPTIONS)))
    .pipe($.if(ENVIRONMENT === PROD_ENV, $.cssnano()))
    .pipe($.if(!ENVIRONMENT === PROD_ENV, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/app/assets/css'))
    .pipe(browser.reload({ stream: true }));
}

// Landing page css concat + minify
function sassLanding() {
  return gulp.src(PATHS.src.landing.scss)
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: PATHS.sass
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: COMPATIBILITY
    }))
    .pipe($.concat('main.css'))
    .pipe($.cssnano())
    .pipe(gulp.dest(PATHS.dist + '/css'))
    .pipe(browser.reload({ stream: true }));
}

/////////////////////
//
// TEMPLATES

// App
function templates() {
  return gulp.src(PATHS.src.app.html)
    .pipe($.angularTemplatecache({
      module: 'hearth.templates',
      transformUrl: (name) => {
        return 'assets/' + name;
      },
      standalone: true
    }))
    .pipe(gulp.dest(PATHS.dist + '/app/assets/templates'));
}

// Landing page
// this doesn't work as a gulp plugin should, but it works as required, so .. whatever
function templatesLanding() {
  return gulp.src(PATHS.src.landing.index)
    .pipe(i18nStatic({
      baseDir: PATHS.src.landing.index,
      outputDir: PATHS.dist,
      locales: ['en', 'cs', 'sk'],
      locale: 'en',
      localesPath: PATHS.temp + '/locales/landing',

      selector: '[t]',
      allowHtml: true,
      removeAttr: true
    }));
}

/////////////////////
//
// LOCALES

function getLocalePaths(opts = {}) {
  var pathId;
  if (typeof opts === 'string') {
    pathId = opts;
  } else {
    pathId = opts.id;
  }
  if (!pathId) throw new TypeError('Locale ID may not be undefined.');
  var paths = [];
  Object.keys(LOCALE.languages).forEach(lang => {
    paths.push({
      file: (opts.createFolders ? lang + '/index' : lang) + '.json',
      url: LOCALE.getPath[pathId].replace('{langVal}', LOCALE.languages[lang])
    });
  });
  return paths;
}

// App locales
function localesApp() {
  return download(getLocalePaths('app'))
    .pipe(gulp.dest(PATHS.dist + '/app/assets/locale/'))
}

// Landing locales
function localesLanding() {
  return download(getLocalePaths('landing'))
  .pipe(gulp.dest(PATHS.temp + '/locales/landing'))
}

/////////////////////
//
// LIBRARIES

// App
function appLibsCss() {
  return gulp.src(PATHS.libs.app.css)
    .pipe($.concat('libs.css'))
    .pipe(gulp.dest(PATHS.dist + '/app/assets/css'))
}
function appLibsJs() {
  return gulp.src(PATHS.libs.app.js)
    .pipe($.concat('libs.js'))
    .pipe(gulp.dest(PATHS.dist + '/app/assets/js'))
}
// jQuery is handled separately, as it is required to have it loaded in head,
// apart from all other code that has to be loaded at the end of body
function jQuery() {
  return gulp.src(PATHS.libs.app.jq)
    .pipe($.concat('jquery.js'))
    .pipe(gulp.dest(PATHS.dist + '/app/assets/js'))
}

/////////////////////
//
// IMAGES

// Copy images to the "dist" folder
// In production, the images are compressed
function images() {
  return gulp.src(PATHS.src.app.img)
    .pipe($.if(ENVIRONMENT === PROD_ENV, $.imagemin({
      progressive: true
    })))
    .pipe(gulp.dest(PATHS.dist + '/app/assets/img'));
}

function imagesLanding() {
  return gulp.src(PATHS.src.landing.img)
    .pipe($.if(ENVIRONMENT === PROD_ENV, $.imagemin({
      progressive: true
    })))
    .pipe(gulp.dest(PATHS.dist + '/img'));
}

/////////////////////
//
// CONFIGS

// App configs
function configs() {
  return gulp.src([
    PATHS.src.configs.app[ENVIRONMENT],
    PATHS.src.configs.global,
  ])
    .pipe($.concat('config.js'))
    .pipe(gulp.dest(PATHS.dist + '/app/assets/js'));
}

/////////////////////
//
// COPY

// Common root
function copyCommonRoot() {
  return gulp.src(PATHS.common.assets)
    .pipe(gulp.dest(PATHS.dist));
}

// App root
function copyRoot() {
  return gulp.src(PATHS.index)
    .pipe(gulp.dest(PATHS.dist + '/app'));
}

// App fonts
function copyFonts() {
  return gulp.src(PATHS.fonts)
    .pipe(gulp.dest(PATHS.dist + '/app/assets/fonts'));
}

// Landing page fonts
function copyFontsLanding() {
  return gulp.src(PATHS.src.landing.fonts)
    .pipe(gulp.dest(PATHS.dist + '/fonts'));
}

////////////////////////////////////////
//
// SERVER, RELOAD & WATCH

// TODO make this somehow .. nicer
function isAllowedUrl(url) {
  if (url === '/app/kit.html') return true;
}

// Start a server with BrowserSync to preview the site in
function server(done) {
  browser.init({
    server: {
      baseDir: PATHS.dist
    },
    host: HOST,
    middleware: [
      function(req, res, next) {
        if (
          req.url.indexOf('/app/') >= 0
          && !isAllowedUrl(req.url)
          && req.url.indexOf('/app/assets/') < 0
          && req.url !== '/app/'
        ) {
          req.url = '/app/';
        }
        return next();
      }
    ],
    startPath: '/app',
    // open: 'external', // 192.168.99.1
    port: PORT,
  });
  done();
}

// Reload the browser with BrowserSync
function reload(done) {
  browser.reload();
  done();
}

function getSeries(...args) {
  if (BROWSER_RELOAD) args.push(browser.reload);
  return gulp.series(...args);
}

// Watch for changes to static assets, pages, Sas)s, and JavaScript
function watch() {
  // APP
  gulp.watch(PATHS.index).on('all', getSeries(copyRoot));
  gulp.watch(PATHS.src.app.html).on('all', getSeries(templates));
  gulp.watch(['common/config/**/*.js', 'app/config/**/*.js']).on('all', getSeries(configs));
  gulp.watch(PATHS.src.app.scss).on('all', getSeries(sass));
  gulp.watch(PATHS.src.app.js).on('all', getSeries(javascript));
  gulp.watch(PATHS.src.app.img).on('all', getSeries(images));

  // LP
  gulp.watch(PATHS.src.landing.js).on('all', getSeries(javascriptLanding));
  gulp.watch(PATHS.src.landing.index).on('all', getSeries(templatesLanding));
  gulp.watch(PATHS.src.landing.scss).on('all', getSeries(sassLanding));
}