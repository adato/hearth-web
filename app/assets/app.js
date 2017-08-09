'use strict';

angular.module('hearth', [
		'hearth.services',
		'hearth.filters',
		'hearth.directives',
		'hearth.controllers',
		'hearth.constants',
		'hearth.utils',
		'hearth.geo',
		'hearth.templates',

		'ngSanitize',
		'ngResource',
		'ngDialog',
		'ngMessages',
		'tmh.dynamicLocale',
		'ui.select',
		'ui.router',
		'angular-flexslider',
		'pascalprecht.translate',
		'ng-slide-down',
		'angulartics',
		'angulartics.mixpanel',
		'angulartics.google.analytics',
		'ngTagsInput',
		'ipCookie',
		'satellizer',
		'MobileDetect',
		'checklist-model',
		'ngActionCable',
		'internationalPhoneNumber'
	])
	.config(['$sceProvider', '$locationProvider',
		function($sceProvider, $locationProvider) {
			$locationProvider.html5Mode(true);
		}
	]).config([
		'$compileProvider', '$httpProvider',
		function($compileProvider, $httpProvider) {
			$compileProvider.debugInfoEnabled($$config.angularDebugInfoEnabled);
			$httpProvider.useApplyAsync(true);
		}
	]).config([
		'tmhDynamicLocaleProvider', '$translateProvider',
		function(tmhDynamicLocaleProvider, $translateProvider) {
			// Localization

			// get preferred language from cookies or config
			// configure dynamic locale - dates && pluralization && etc
			// tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');
			tmhDynamicLocaleProvider.localeLocationPattern('//cdnjs.cloudflare.com/ajax/libs/angular-i18n/1.2.15/angular-locale_{{locale}}.js');
			// configure translate provider - where language constants are
			$translateProvider.preferredLanguage(window.preferredLanguage || 'en');
			$translateProvider.useSanitizeValueStrategy(null);

			$translateProvider.useStaticFilesLoader({
				prefix: 'assets/locale/',
				suffix: '.json'
			});
		}
	]).config([
		'$httpProvider', '$translateProvider', '$authProvider', '$windowProvider',
		function($httpProvider, $translateProvider, $authProvider, $windowProvider) {

			var $window = $windowProvider.$get();

			function getRefsArray() {
				function getCookie(cname) {
					var name = cname + '=';
					var cookies = document.cookie.split(';');
					for (var i = 0; i < cookies.length; i++) {
						var c = cookies[i];
						while (c.charAt(0) === ' ') c = c.substring(1);
						if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
					}
					return '';
				}
				var refs = getCookie($$config.referrerCookieName);
				if (refs) {
					refs = refs.split('-');
					if (refs.length) return refs;
				}
				return '';
			}

			function getRefsString(refsArray) {
				if (refsArray && refsArray.length) {
					var refsString = '?';
					for (var i = refsArray.length; i--;) {
						refsString += $$config.referrerCookieName + '[]=' + refsArray[i] + '&';
					}
					return refsString.slice(0, -1);
				}
				return '';
			}
			$window.refsArray = getRefsArray();
			$window.refsString = getRefsString($window.refsArray);

			var $log = angular.injector(['ng']).get('$log'); // instantiate logger class

			$authProvider.loginRedirect = false;
			$authProvider.httpInterceptor = false;
			$authProvider.tokenName = 'api_token';

			$authProvider.facebook({
				clientId: $$config.oauth.facebook,
				url: $window.encodeURI($$config.apiPath + '/auth/facebook' + $window.refsString),
  			authorizationEndpoint: 'https://www.facebook.com/v2.8/dialog/oauth'
			});

			$authProvider.google({
				clientId: $$config.oauth.google,
				url: $window.encodeURI($$config.apiPath + '/auth/google' + $window.refsString),
				popupOptions: {
					width: 660,
					height: 500
				}
			});

			// Configure ajax calls

			// Allow CORS
			$httpProvider.defaults.useXDomain = true;
			$httpProvider.defaults.withCredentials = true;
			delete $httpProvider.defaults.headers.common['X-Requested-With'];

			// Add language header
			$httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
			// $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
			$httpProvider.defaults.headers.common['Accept'] = 'application/vnd.hearth-v1+json';
			$httpProvider.defaults.headers.common['Accept-Language'] = $window.preferredLanguage;
			$httpProvider.defaults.headers.common['X-API-TOKEN'] = $.cookie("authToken");
			$httpProvider.defaults.headers.common['X-DEVICE'] = getDevice();
			$httpProvider.defaults.headers.common['X-API-VERSION'] = '1'; // hard use version of API

			$httpProvider.defaults.headers.common['X-Pagination-Count'];

			var params = $.getUrlVars();
			if (params['apiError'])
				params['apiError'].split(',').forEach(function(type) {
					$log.info('Enabling api test errors for', type);
					$httpProvider.defaults.headers[type]['x-error-test'] = 1;
				});

			// Watch for unauth responses
			$httpProvider.interceptors.push('HearthLoginInterceptor');
			$httpProvider.interceptors.push('ApiErrorInterceptor');
			$httpProvider.interceptors.push('ApiMaintenanceInterceptor');
		}
	]).config(['$provide', 'ipnConfig',
		function($provide, ipnConfig) {
			$provide.decorator('$exceptionHandler', ['$delegate', '$window', function($delegate, $window) {
				return function(exception, cause) {
					if ($window.Rollbar) {
						$window.Rollbar.error(exception, {
							cause: cause
						});
					}
					$delegate(exception, cause);
				};
			}]);

			ipnConfig.skipUtilScriptDownload = true;
		}
	]).config(['InfoBubbleSetup',
		function(InfoBubbleSetup) {

			InfoBubbleSetup.enabled = false

			InfoBubbleSetup.templateGet = type => `assets/components/infoBubble/templates/infoBubble${type}Wrapper.html`

			InfoBubbleSetup.typeMap.user = 'User'
		  InfoBubbleSetup.typeMap.location = 'Location'
		  InfoBubbleSetup.typeMap.community = 'Community'

		}
	]).run(['$rootScope', 'Auth', '$location', '$templateCache', '$http', '$translate', 'tmhDynamicLocale', '$locale', 'LanguageSwitch', 'OpenGraph', 'UnauthReload', '$urlRouter', '$log', 'ActionCableConfig', '$window', 'Session', 'User',
		function($rootScope, Auth, $location, $templateCache, $http, $translate, tmhDynamicLocale, $locale, LanguageSwitch, OpenGraph, UnauthReload, $urlRouter, $log, ActionCableConfig, $window, Session, User) {
			$rootScope.appInitialized = false;
			$rootScope.config = $$config;

			ActionCableConfig.wsUri = $$config.websocket.url;
			ActionCableConfig.debug = $$config.websocket.debug;
			ActionCableConfig.autoStart = false;

			/**
			 * This will cache some files at start
			 */
			// function cacheFiles(done) {
			//
			// 	// cache tooltip in MAP -- DEPRECATED -- remove when map will be refactored
			// 	$http.get('assets/components/geo/markerTooltip.html', {
			// 		cache: $templateCache
			// 	});
			// 	done(null);
			// }

			/**
			 * This will init app language
			 */
			function initLanguage(done) {
				// $translate.use(preferredLanguage); // already loaded from config
				tmhDynamicLocale.set($window.preferredLanguage);

				var offEvent = $rootScope.$on('$translateLoadingSuccess', function($event, data) {
					offEvent(); // unregister event listener
					LanguageSwitch.init();
					$rootScope.language = $window.preferredLanguage;
					$rootScope.languageInited = true;
					$rootScope.$broadcast("initLanguageSuccess", $window.preferredLanguage);
					done(null, data);
				});
			}

			function bindCriticalReloadEvent() {
				$('#criticalError a').click(function() {
					location.reload(true);
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
					if ($rootScope.loggedUser._id) UnauthReload.checkLocation();

					if (typeof mixpanel !== 'undefined') { // verify if mixpanel is present, prevent fail with adblock
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
					}

					$rootScope.$broadcast("initSessionSuccess", $rootScope.loggedUser);
					done(null, $rootScope.loggedUser);
				}, function(err) {
					$log.error(err.status, err.statusText, err.data);
					Rollbar.error("HEARTH: session critical error occured", {
						status: err.status,
						statusText: err.statusText,
						data: err.data
					});

					$('#criticalError').fadeIn();
					bindCriticalReloadEvent();
					$rootScope.isCriticalError = true;

					var offEvent = $rootScope.$on('$translateLoadingSuccess', function($event, data) {
						offEvent();
						setTimeout(bindCriticalReloadEvent);
					});
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

			// UNCOMMENT FOR OFFLINE MODE .. HA!
			// kept in if, just to make sure it never makes its way into production
			// if ($$config.env === 'development') {
			// 	console.info('OFFLINE MODE ACTIVE');
			// 	$urlRouter.sync();
			// 	$urlRouter.listen();
			// 	$rootScope.initFinished = true;
			// 	$rootScope.loggedUser = $rootScope.loggedUser || {};
			// 	$rootScope.loggedUser._id = 1;
			// 	$rootScope.$broadcast("initFinished");
			// }

			// Init hearth core parts
			async.parallel({
				language: initLanguage, // download language files
				session: initSession, // get user session from api
				openGraph: initOpenGraph, // fill default og info
				// cacheFiles: cacheFiles, // cache some files at start
			}, function(err, init) {
				$urlRouter.sync();
				$urlRouter.listen();

				$rootScope.debug = !!$.cookie('debug');
				$rootScope.initFinished = true;
				$rootScope.$broadcast('initFinished');
			});
		}
	]).run(['PageTitle', function(PageTitle) {
			/** Set default title, postfix, delimiter */
			PageTitle.setDefault('', 'Hearth.net');
	}]);

// INIT MODULES
angular.module('hearth.constants', []);
angular.module('hearth.controllers', []);
angular.module('hearth.directives', []);
angular.module('hearth.services', []);
angular.module('hearth.utils', []);

/**
 * @description all code working with Google MAPS api
 */
angular.module('hearth.geo', []);