'use strict';

import plugins  from 'gulp-load-plugins';
import yargs    from 'yargs';
import browser  from 'browser-sync';
import gulp     from 'gulp';
import panini   from 'panini';
import rimraf   from 'rimraf';
import sherpa   from 'style-sherpa';
import yaml     from 'js-yaml';
import fs       from 'fs';

// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Check for --reload flag
// Causes browser reload on file changes
const BROWSER_RELOAD = !!(yargs.argv.reload);

// TODO: This clashes a bit with foundation's PRODUCTION flag .. but whatever ATM
const ENVIRONMENT = yargs.argv.target || 'localhost';

// Load settings from settings.yml
const { COMPATIBILITY, PORT, UNCSS_OPTIONS, PATHS, LOCALE } = loadConfig();

function loadConfig() {
  let ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}

// Build the "dist" folder by running all of the below tasks
gulp.task('build',
  gulp.series(
    clean,
    gulp.parallel(
      templates,
      sass,
      configs,
      javascript,
      images,
      // copy, // empty task ATM
      copyRoot,

      // external libs
      appLibsJs,
      jQuery,
      appLibsCss
    )
    // styleGuide
  )
);

// Build the site, run the server, and watch for file changes
gulp.task('default',
  gulp.series('build', server, watch)
);

// Run just the sass task
// .. mainly for foundation v5 to v6 upgrade purposes
gulp.task('sass',
  gulp.series(sass)
);

const localeGetters = (function() {
  var arr = [];
  LOCALE.languages.forEach(lang => {
    var path = LOCALE.getPath.replace('{langVal}', lang);
    arr.push(
      function() {
        return $.gulpRemoteSrc(path)
          .pipe(gulp.dest(PATHS.dist + '/locale/' + lang + '/messages'))

      }
    );
  }
  return arr;
})();
gulp.task('locales',
  gulp.parallel(...localeGetters)
);

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
  rimraf(PATHS.dist, done);
}

// APP COPY
// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
function copy() {
  return gulp.src(PATHS.assets)
    .pipe(gulp.dest(PATHS.dist + '/app/assets'));
}

// APP ROOT
function copyRoot(path) {
  return gulp.src(PATHS.index)
    .pipe(gulp.dest(PATHS.dist + '/app'));
}

// Copy page templates into finished HTML files
// function pages() {
//   return gulp.src('src/pages/**/*.{html,hbs,handlebars}')
//     .pipe(panini({
//       root: 'src/pages/',
//       layouts: 'src/layouts/',
//       partials: 'src/partials/',
//       data: 'src/data/',
//       helpers: 'src/helpers/'
//     }))
//     .pipe(gulp.dest(PATHS.dist));
// }

// Load updated HTML templates and partials into Panini
// function resetPages(done) {
//   panini.refresh();
//   done();
// }

// APP TEMPLATES
function templates() {
  // console.log($);
  return gulp.src(PATHS.src.app.html)
    .pipe($.angularTemplatecache({
      module: 'hearth.templates',
      standalone: true
    }))
    .pipe(gulp.dest(PATHS.dist + '/app/assets/templates'));
}

// Generate a style guide from the Markdown content and HTML template in styleguide/
// function styleGuide(done) {
//   sherpa('app/styleguide/index.md', {
//     output: PATHS.dist + '/styleguide.html',
//     template: 'app/styleguide/template.html'
//   }, done);
// }

// APP CSS
// Compile Sass into CSS
// In production, the CSS is compressed
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
    //.pipe($.if(PRODUCTION, $.uncss(UNCSS_OPTIONS)))
    .pipe($.if(PRODUCTION, $.cssnano()))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/app/assets/css'))
    .pipe(browser.reload({ stream: true }))
    ;
}

// APP LIBS
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

// APP JS
// Combine JavaScript into one file
// In production, the file is minified
function javascript() {
  return gulp.src(PATHS.src.app.js, PATHS.javascript)
    .pipe($.sourcemaps.init())
    .pipe($.babel({ignore: ['what-input.js']}))
    .pipe($.concat('app.js'))
    .pipe($.if(PRODUCTION, $.uglify()
      .on('error', e => { console.log(e); })
    ))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/app/assets/js'));
}

// APP IMG
// Copy images to the "dist" folder
// In production, the images are compressed
function images() {
  return gulp.src(PATHS.src.app.img)
    .pipe($.if(PRODUCTION, $.imagemin({
      progressive: true
    })))
    .pipe(gulp.dest(PATHS.dist + '/app/assets/img'));
}

// Start a server with BrowserSync to preview the site in
function server(done) {
  browser.init({
    server: PATHS.dist, port: PORT
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

// APP CONFIGS
function configs() {
  return gulp.src([
    PATHS.src.configs.app[ENVIRONMENT],
    PATHS.src.configs.global,
  ])
    .pipe($.concat('config.js'))
    .pipe(gulp.dest(PATHS.dist + '/app/assets/js'));
}

// Watch for changes to static assets, pages, Sas)s, and JavaScript
function watch() {
  gulp.watch(PATHS.assets, copy);

  // template handling is different from foundation default
  // gulp.watch('src/pages/**/*.html').on('all', getSeries(pages));
  // gulp.watch('src/{layouts,partials}/**/*.html').on('all', getSeries(resetPages, pages));
  gulp.watch(PATHS.src.app.html).on('all', getSeries(templates, copyRoot));

  gulp.watch(['/common/config/**/*.js', '/app/config/**/*.js']).on('all', getSeries(configs));

  gulp.watch(PATHS.src.app.scss).on('all', getSeries(sass));
  gulp.watch(PATHS.src.app.js).on('all', getSeries(javascript));
  gulp.watch(PATHS.src.app.img).on('all', getSeries(images));

  // styleguide is unneded atm .. kept for future reference in case we want to make UI-kit from it or anything
  // gulp.watch('app/styleguide/**').on('all', getSeries(styleGuide));
}
