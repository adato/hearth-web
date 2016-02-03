'use strict';

angular.module('hearth', [
		'ngDialog', 'tmh.dynamicLocale', 'ui.select', 'ui.router', 'angular-flexslider',
		'ngSanitize', 'ngResource', 'pascalprecht.translate', 'hearth.services',
		'hearth.filters', 'hearth.directives', 'ng-slide-down', 'hearth.controllers', 'angulartics', 'angulartics.mixpanel', 'angulartics.google.analytics',
		'chieffancypants.loadingBar', 'ngTagsInput', 'ipCookie', 'hearth.utils', 'hearth.geo', 'hearth.messages', 'satellizer', 'MobileDetect'
	])
	.config(['$sceProvider', '$locationProvider',
		function($sceProvider, $locationProvider) {

			// ============================
			// === Location Configuration
			// ============================
			$locationProvider.html5Mode(true);
		}
	]).config([
		'cfpLoadingBarProvider', '$compileProvider', '$httpProvider',
		function(cfpLoadingBarProvider, $compileProvider, $httpProvider) {

			$compileProvider.debugInfoEnabled($$config.disableDebugInfo);
			$httpProvider.useApplyAsync(true);

			// ===============================
			// === Loading Bar Configuration
			// ===============================
			cfpLoadingBarProvider.includeSpinner = false;
			return cfpLoadingBarProvider.includeSpinner;
		}
	]).config([
		'tmhDynamicLocaleProvider', '$translateProvider',
		function(tmhDynamicLocaleProvider, $translateProvider) {

			// ===============================
			// === Localization
			// ===============================

			// get preferred language from cookies or config
			// console.log("Setting preffered language", preferredLanguage);

			// configure dynamic locale - dates && pluralization && etc
			// tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');
			tmhDynamicLocaleProvider.localeLocationPattern('//cdnjs.cloudflare.com/ajax/libs/angular-i18n/1.2.15/angular-locale_{{locale}}.js');
			// configure translate provider - where language constants are
			$translateProvider.preferredLanguage(preferredLanguage);
			$translateProvider.useSanitizeValueStrategy(null);

			//  ====================== REVIEW ================
			// $translateProvider.useStorage('SessionLanguageStorage');
			$translateProvider.useStaticFilesLoader({
				prefix: 'locales/',
				suffix: '/messages.json'
			});
		}
	]).config([
		'$httpProvider', '$translateProvider', '$authProvider',
		function($httpProvider, $translateProvider, $authProvider) {

			$authProvider.loginRedirect = false;
			$authProvider.httpInterceptor = false;
			$authProvider.tokenName = 'api_token';
			$authProvider.facebook({
				clientId: $$config.oauth.facebook,
				url: $$config.apiPath + '/auth/facebook'
			});

			$authProvider.google({
				clientId: $$config.oauth.google,
				url: $$config.apiPath + '/auth/google',
				popupOptions: {
					width: 660,
					height: 500
				}
			});

			// ===============================
			// === Configure ajax calls
			// ===============================

			// Allow CORS
			$httpProvider.defaults.useXDomain = true;
			$httpProvider.defaults.withCredentials = true;
			delete $httpProvider.defaults.headers.common['X-Requested-With'];

			// Add language header
			$httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
			// $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
			$httpProvider.defaults.headers.common['Accept-Language'] = preferredLanguage;
			$httpProvider.defaults.headers.common['X-API-TOKEN'] = $.cookie("authToken");
			$httpProvider.defaults.headers.common['X-DEVICE'] = getDevice();

			// // ======== Watch for unauth responses
			$httpProvider.interceptors.push('HearthLoginInterceptor');
			$httpProvider.interceptors.push('ApiMaintenanceInterceptor');

			// // ======== ?? wtf is this?
			// $httpProvider.responseInterceptors.push('TermsAgreement');
		}
	]).config(['$provide',
		function($provide) {
			$provide.decorator("$exceptionHandler", function($delegate, $window) {
				return function(exception, cause) {
					if ($window.Rollbar) {
						$window.Rollbar.error(exception, {
							cause: cause
						});
					}
					$delegate(exception, cause);
				};
			});
		}
	]).run([
		'$rootScope', 'Auth', '$location', '$templateCache', '$http', '$translate', 'tmhDynamicLocale', '$locale', 'LanguageSwitch', 'OpenGraph', 'UnauthReload', '$urlRouter',
		function($rootScope, Auth, $location, $templateCache, $http, $translate, tmhDynamicLocale, $locale, LanguageSwitch, OpenGraph, UnauthReload, $urlRouter) {
			$rootScope.appInitialized = false;
			$rootScope.config = $$config;

			/*            $http.get('https://api.dev.hearth.net/', function(err, res) {
			 console.log(err, res);
			 });*/

			/**
			 * This will cache some files at start
			 */
			function cacheFiles(done) {

				// cache tooltip in MAP -- DEPRECATED -- remove when map will be refactored
				$http.get('templates/geo/markerTooltip.html', {
					cache: $templateCache
				});
				done(null);
			}

			/**
			 * This will init app language
			 */
			function initLanguage(done) {
				// $translate.use(preferredLanguage); // already loaded from config
				tmhDynamicLocale.set(preferredLanguage);

				var offEvent = $rootScope.$on('$translateLoadingSuccess', function($event, data) {
					offEvent(); // unregister event listener
					LanguageSwitch.init();
					$rootScope.language = preferredLanguage;
					$rootScope.languageInited = true;
					$rootScope.$broadcast("initLanguageSuccess", preferredLanguage);
					done(null, data);
				});
			}

			/**
			 * This will init session of user
			 */
			function initSession(done) {
				// get session info from API
				Auth.init(function() {

					// enrich rootScope with user/community credentials
					angular.extend($rootScope, Auth.getSessionInfo());

					// if is logged, check if he wanted to see some restricted page
					if ($rootScope.loggedUser._id) {

						if (!$.cookie('forceRefresh')) {

							var cookies = $.cookie();
							for (var cookie in cookies) {
								$.removeCookie(cookie);
							}
							$.cookie('forceRefresh', Date.now(), {
								expires: 30 * 12 * 20,
								path: '/'
							});
							Auth.logout(function() {
								location.reload("/login");
							});
						}

						UnauthReload.checkLocation();
					} else {
						$.cookie('forceRefresh', Date.now(), {
							expires: 30 * 12 * 20,
							path: '/'
						});
					}

					if ($rootScope.loggedUser && $rootScope.loggedUser._id) {
						mixpanel.identify($rootScope.loggedUser._id);
						mixpanel.people.set({
							"$name": $rootScope.loggedUser.name,
							"$email": $rootScope.loggedUser.email,
							"$device-type": getDevice()
						});
					} else {
						mixpanel.people.set({
							"$device-type": getDevice()
						});
					}

					$rootScope.$broadcast("initSessionSuccess", $rootScope.loggedUser);
					done(null, $rootScope.loggedUser);
				});
			}

			/**
			 * When localization loaded, fill opengraph info
			 */
			function initOpenGraph(done) {

				$rootScope.$on('$translateChangeSuccess', function() {

					OpenGraph.setDefaultInfo($translate.instant('OG_DEFAULT_TITLE'), $translate.instant('OG_DEFAULT_DESCRIPTION'), $$config.appUrl + $$config.defaultHearthImage, $$config.defaultHearthImageWidth, $$config.defaultHearthImageHeight);
					OpenGraph.setDefault();

					// reset OG to default when changing location
					$rootScope.$on("$locationChangeStart", function(loc) {
						OpenGraph.setDefault();
					});
				});

				done(null);
			}

			// === Init hearth core parts
			async.parallel({
				language: initLanguage, // download language files
				session: initSession, // get user session from api
				openGraph: initOpenGraph, // fill default og info
				cacheFiles: cacheFiles, // cache some files at start
			}, function(err, init) {

				$urlRouter.sync();
				$urlRouter.listen();

				$(document).foundation({
					offcanvas: {
						close_on_click: true
					}
				});

				$rootScope.debug = !!$.cookie("debug");
				$rootScope.initFinished = true;
				$rootScope.$broadcast("initFinished");
			});
		}
	]).run([
		'PageTitle',
		function(PageTitle) {
			/** Set default title, postfix, delimiter */
			PageTitle.setDefault('', 'Hearth.net');
		}
	]);

angular.module('hearth.controllers', []);
angular.module('hearth.directives', []);
angular.module('hearth.services', []);
angular.module('hearth.utils', []);

/**
 * @description all code working with Google MAPS api
 */
angular.module('hearth.geo', []);

/**
 * @description all code solves messaging feature
 */
angular.module('hearth.messages', []);