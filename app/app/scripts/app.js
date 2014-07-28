'use strict';

angular.module('hearth', ['ngRoute', 'ngSanitize', 'ngResource', 'pascalprecht.translate', 'angular-flash.service', 'angular-flash.flash-alert-directive', 'hearth.services', 'hearth.filters', 'hearth.directives', 'hearth.controllers', 'angulartics', 'angulartics.ga', 'chieffancypants.loadingBar', 'ngTagsInput', 'hearth.utils', 'hearth.geo', 'hearth.messages'])
	.config(['$sceProvider', '$locationProvider',
		function($sceProvider, $locationProvider) {
			$locationProvider.html5Mode(false).hashPrefix('!');
		}
	]).config([
		'cfpLoadingBarProvider',
		function(cfpLoadingBarProvider) {
			cfpLoadingBarProvider.includeSpinner = false;
			return cfpLoadingBarProvider.includeSpinner;
		}
	]).config([
		'$translateProvider',
		function($translateProvider) {
			preferredLanguage = preferredLanguage || 'cs';
			$translateProvider.translations(preferredLanguage, translations[preferredLanguage]);
			$translateProvider.preferredLanguage(preferredLanguage);
			$translateProvider.useStaticFilesLoader({
				prefix: 'locales/',
				suffix: '/messages.json'
			});
			return $translateProvider.useStorage('SessionLanguageStorage');
		}
	]).config([
		'$httpProvider', '$translateProvider',
		function($httpProvider, $translateProvider) {
			$httpProvider.defaults.headers.common['Accept-Language'] = $translateProvider.preferredLanguage();
			return $httpProvider.responseInterceptors.push('TermsAgreement');
		}
	]).config([
		'$routeProvider',
		function($routeProvider) {
			return $routeProvider
			.when('/search/?', {
				templateUrl: 'templates/fulltext.html',
				controller: 'FulltextCtrl',
				reloadOnSearch: false,
			}).when('/communities/:action?', {
				templateUrl: 'templates/communityList.html',
				controller: 'CommunityListCtrl',
				pageType: 'communities'
			}).when('/community/:id/:action?', {
				templateUrl: 'templates/communityProfile.html',
				controller: 'CommunityProfileCtrl',
				pageType: 'community-profile',
				reloadOnSearch: false
			}).when('/community-create', {
				templateUrl: 'templates/communityRegister.html',
				controller: 'CommunityRegisterCtrl',
				pageType: 'community-create'
			}).when('/', {
				templateUrl: 'templates/market.html',
				controller: 'MarketCtrl',
				reloadOnSearch: false,
				pageType: 'search'
			}).when('/my', {
				templateUrl: 'templates/my.html',
				controller: 'SearchCtrl',
				reloadOnSearch: false,
				pageType: 'my'
			}).when('/register', {
				templateUrl: 'templates/register.html',
				controller: 'RegisterCtrl'
			}).when('/login', {
				templateUrl: 'templates/login.html',
				controller: 'LoginCtrl',
				pageType: 'login'
			}).when('/profile/:id', {
				templateUrl: 'templates/profile.html',
				controller: 'ProfileCtrl',
				reloadOnSearch: false,
				pageType: 'profile'
			}).when('/profile/:id/:action', {
				templateUrl: 'templates/profile.html',
				controller: 'ProfileCtrl',
				reloadOnSearch: false,
				pageType: 'profile'
			}).when('/confirmEmail', {
				templateUrl: 'templates/confirmEmail.html',
				controller: 'ConfirmEmailCtrl'
			}).when('/change-password', {
				templateUrl: 'templates/changePassword.html',
				controller: 'ChangePwdCtrl',
				access: 'private'
			}).when('/forgotten-password', {
				templateUrl: 'templates/forgottenPassword.html',
				controller: 'ForgottenPasswordCtrl'
			}).when('/reset-password', {
				templateUrl: 'templates/resetPassword.html',
				controller: 'ResetPwdCtrl'
			}).when('/feedback', {
				templateUrl: 'templates/feedback.html',
				controller: 'FeedbackCtrl',
				pageType: 'feedback'
			}).when('/404', {
				templateUrl: 'templates/404.html'
			}).when('/setup', {
				templateUrl: 'templates/setup.html',
				controller: 'SetupCtrl'
			}).when('/terms', {
				controller: 'TermsCtrl',
				templateUrl: 'templates/terms.html'
			}).when('/about', {
				templateUrl: 'templates/about.html',
				pageType: 'about'
			})/*.when('/messages', {
				controller: 'Messages',
				templateUrl: 'templates/messages/messages.html'
			})*/.when('/ad/:id', {
				controller: 'ItemDetail',
				templateUrl: 'templates/itemDetail.html'
			}).otherwise({
				redirectTo: '/'
			});
		}
	]).factory('HearthLoginInterceptor', [
		'$q', '$location', '$timeout', '$rootScope',
		function($q, $location, $timeout, $rootScope) {
			return function(promise) {
				return promise.then(function(response) {
					return response;
				}, function(response) {
					if (response.status === 401) {
						$rootScope.referrerUrl = $location.path();
						$location.path('/login');
					}
					return $q.reject(response);
				});
			};
		}
	]).config([
		'$httpProvider',
		function($httpProvider) {
			return $httpProvider.responseInterceptors.push('HearthLoginInterceptor');
		}
	]).run([
		'$rootScope', 'Auth', '$location', 'ipCookie', '$templateCache', '$http',
		function($rootScope, Auth, $location, ipCookie, $templateCache, $http) {
			$http.get('templates/geo/markerTooltip.html', {
				cache: $templateCache
			});
			$rootScope.appInitialized = false;
			Auth.init(function() {
				$rootScope.appInitialized = true;
				$rootScope.loggedUser = Auth.getCredentials();
				$rootScope.loggedEntity = Auth.getBaseCredentials();
				return $rootScope.loggedCommunity = Auth.getCommunityCredentials();
			});
			$rootScope.$on('onUserLogin', function() {
				var backUrl;
				backUrl = ipCookie('backUrl');
				if (backUrl) {
					ipCookie('backUrl', null);
					return $location.url(backUrl);
				}
			});
			return $rootScope.$on('$locationChangeStart', function(event, next, current) {
				var url;
				url = current.split('#')[1];
				if (next.match(/login/) && url) {
					if (current.match(/confirmEmail/g) || current.match(/password/g) || url === '/feedback?fromDelete') {
						return;
					}
					return ipCookie('backUrl', url);
				}
			});
		}
	]).run([
		'$rootScope', '$location', '$http', "$translate", "OpenGraph",
		function($rootScope, $location, $http, $translate, OpenGraph) {

			$rootScope.$on('$translateChangeSuccess', function() {
				OpenGraph.setDefaultInfo($translate('OG_DEFAULT_TITLE'), $translate('OG_DEFAULT_DESCRIPTION'));
				OpenGraph.setDefault();
			});
		}
	]);

var __indexOf = [].indexOf || function(item) {
	for (var i = 0, l = this.length; i < l; i++) {
		if (i in this && this[i] === item) {
			return i;
		}
	}
	return -1;
};

angular.module('hearth.controllers', []);
angular.module('hearth.directives', []);
angular.module('hearth.services', ['ivpusic.cookie']);
angular.module('hearth.utils', []);

/**
 * @description all code working with Google MAPS api
 */
angular.module('hearth.geo', []);

/**
 * @description all code solves messaging feature
 */
angular.module('hearth.messages', []);