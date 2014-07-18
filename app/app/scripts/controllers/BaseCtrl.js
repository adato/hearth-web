'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.BaseCtrl
 * @description
 */

angular.module('hearth.controllers').controller('BaseCtrl', [
	'$scope', '$location', '$route', 'Auth', 'flash',  'Errors', '$timeout', '$window', '$rootScope', '$routeParams', 'LanguageSwitch', '$q', '$translate', 'UsersService', 'Info', '$analytics', 'ResponseErrors', 'ipCookie', '$http', 'Post',

	function($scope, $location, $route, Auth, flash, Errors, $timeout, $window, $rootScope, $routeParams, LanguageSwitch, $q, $translate, UsersService, Info, $analytics, ResponseErrors, ipCookie, $http, Post) {
		var timeout;

		$scope.breakpointForSmall = 782;
		$scope.defaultPageType = '';
		$scope.pageType = $scope.defaultPageType;
		$scope.facebookLoginUrl = $$config.apiPath + '/auth/facebook';
		$scope.googleLoginUrl = $$config.apiPath + '/users/auth/google_oauth2';
		$scope.notifications = {};

		$scope.init = function() {
			$scope.flash = flash;
			$scope.languages = LanguageSwitch.getLanguages();
			$scope.languageCode = LanguageSwitch.uses();
			$scope.info = Info.show();
		};

		$scope.$on('$includeContentLoaded', function() {
			if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(function() {
				$(document).foundation();
			}, 1000);
		});

		$scope.$on('$routeChangeSuccess', function(event, currentRoute) {
			$scope.pageType = currentRoute.pageType ? currentRoute.pageType : $location.path() === '/' ? $scope.defaultPageType : void 0;
			return $scope.pageType;
		});
		
		$scope.showUI = function(ui) {
			$scope.$broadcast('showUI', ui);
		};
		$scope.logout = function() {
			Auth.logout();
		};
		$scope.search = function(text) {
			$location.path('/search');
			$location.search('q=' + text);
		};

		$scope.$watch('user', function() {
			var user = $scope.user.get_logged_in_user;
			if (user && user.avatar.normal) {
				$('.navigation .img').css('background-image', 'url(' + user.avatar.normal + ')');
			}
		});

		$scope.isScrolled = false;
		angular.element($window).bind('scroll', function() {
			if ($(window).scrollTop() > 0 !== $scope.isScrolled) {
				$('html').toggleClass('scrolled');
				$scope.isScrolled = !$scope.isScrolled;
			}
		});

		$scope.top = function() {
			$('html, body').animate({
				scrollTop: 0
			}, 1000);
		};
	}
]);