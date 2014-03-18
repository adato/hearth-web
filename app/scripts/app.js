angular.module('hearth', ['ngRoute', 'ngSanitize', 'ngResource', 'pascalprecht.translate', 'angular-flash.service', 'angular-flash.flash-alert-directive', 'hearth.services', 'hearth.filters', 'hearth.directives', 'hearth.controllers', 'angulartics', 'angulartics.ga', 'chieffancypants.loadingBar', 'ngTagsInput'])
	.config(['$sceProvider',
		function($sceProvider) {}
	]).config([
		'cfpLoadingBarProvider',
		function(cfpLoadingBarProvider) {
			return cfpLoadingBarProvider.includeSpinner = false;
		}
	]).config([
		'$translateProvider',
		function($translateProvider) {
			$translateProvider.translations(preferredLanguage, translations[preferredLanguage]);
			$translateProvider.preferredLanguage(preferredLanguage);
			$translateProvider.useStaticFilesLoader({
				prefix: '../locales/',
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
			return $routeProvider.when('/communities/:action?', {
				templateUrl: 'communityList.html',
				controller: 'CommunityListCtrl',
				pageType: 'communities'
			}).when('/community/:id/:action?', {
				templateUrl: 'communityProfile.html',
				controller: 'CommunityProfileCtrl',
				pageType: 'community-profile',
				reloadOnSearch: false
			}).when('/community-create', {
				templateUrl: 'communityRegister.html',
				controller: 'CommunityRegisterCtrl',
				pageType: 'community-create'
			}).when('/search', {
				templateUrl: 'fulltext.html',
				controller: 'SearchCtrl',
				reloadOnSearch: false,
				pageType: 'search'
			}).when('/my', {
				templateUrl: 'my.html',
				controller: 'SearchCtrl',
				reloadOnSearch: false,
				pageType: 'my'
			}).when('/register', {
				templateUrl: 'register.html',
				controller: 'RegisterCtrl'
			}).when('/login', {
				templateUrl: 'login.html',
				controller: 'LoginCtrl',
				pageType: 'login'
			}).when('/profile/:id', {
				templateUrl: 'profile.html',
				controller: 'ProfileCtrl',
				reloadOnSearch: false,
				pageType: 'profile'
			}).when('/profile/:id/:action', {
				templateUrl: 'profile.html',
				controller: 'ProfileCtrl',
				reloadOnSearch: false,
				pageType: 'profile'
			}).when('/confirmEmail', {
				templateUrl: 'confirmEmail.html',
				controller: 'ConfirmEmailCtrl'
			}).when('/change-password', {
				templateUrl: 'changePassword.html',
				controller: 'ChangePwdCtrl',
				access: 'private'
			}).when('/forgotten-password', {
				templateUrl: 'forgottenPassword.html',
				controller: 'ForgottenPasswordCtrl'
			}).when('/reset-password', {
				templateUrl: 'resetPassword.html',
				controller: 'ResetPwdCtrl'
			}).when('/feedback', {
				templateUrl: 'feedback.html',
				controller: 'FeedbackCtrl',
				pageType: 'feedback'
			}).when('/404', {
				templateUrl: '404.html'
			}).when('/setup', {
				templateUrl: 'setup.html',
				controller: 'SetupCtrl'
			}).when('/terms', {
				controller: 'TermsCtrl',
				templateUrl: 'terms.html'
			}).when('/about', {
				templateUrl: 'about.html',
				pageType: 'about'
			}).otherwise({
				redirectTo: '/search'
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
		'$rootScope', 'Auth', '$location', 'ipCookie', '$http',
		function($rootScope, Auth, $location, ipCookie, $http) {
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
	]);