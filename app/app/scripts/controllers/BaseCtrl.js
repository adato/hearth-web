'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.BaseCtrl
 * @description
 */

angular.module('hearth.controllers').controller('BaseCtrl', [
	'$scope', '$location', '$route', 'Auth', 'flash', 'PostsService', 'Errors', '$timeout', '$window', '$rootScope', '$routeParams', 'LanguageSwitch', '$q', '$translate', 'UsersService', 'Info', '$analytics', 'ResponseErrors', 'ipCookie', '$http', 'Post',

	function($scope, $location, $route, Auth, flash, PostsService, Errors, $timeout, $window, $rootScope, $routeParams, LanguageSwitch, $q, $translate, UsersService, Info, $analytics, ResponseErrors, ipCookie, $http, Post) {
		var timeout;

		$scope.breakpointForSmall = 782;
		$scope.defaultPageType = '';
		$scope.pageType = $scope.defaultPageType;
		$scope.facebookLoginUrl = $$config.apiPath + '/auth/facebook';
		$scope.googleLoginUrl = $$config.apiPath + '/users/auth/google_oauth2';
		$scope.notifications = {};
		$scope.init = function() {
			$scope.navigator = navigator;
			$scope.flash = flash;
			$scope.languages = LanguageSwitch.getLanguages();
			$scope.languageCode = LanguageSwitch.uses();
			$scope.info = Info.show();
			return $scope.checkNotifications();
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

		$scope.$on('sendReply', function($event, data) {
			PostsService.reply(data);
		});

		$scope.$on('report', function($event, data) {
			Post.spam(data);
		});

		$scope.useLanguage = function(language) {
			return LanguageSwitch.use(language).then(function() {
				$scope.languageCode = language;
				return $scope.languageCode;
			});
		};
		$scope.logout = function(language) {
			Auth.logout();
		};
		$scope.search = function(text) {
			$location.path('/search');
			$location.search('q=' + text);
		};
		$scope.expandAd = function(ad, force) {
			var formScope, _ref;
			formScope = angular.element($('form[name=replyForm]')).scope();
			if (formScope != null) {
				if (formScope.replyForm != null) {
					formScope.replyForm.$setPristine();
				}
				if (formScope.errors != null) {
					delete formScope.errors;
				}
			}
			$scope.replyToAdSubmitted = false;
			$rootScope.$broadcast('cancelReplyingAd');
			if (ad === null || (($scope.ad != null) && $scope.ad._id === ad._id)) {
				$scope.ad = null;
				if ((force != null) && force) {
					$location.search('id', null);
				}
				$rootScope.$broadcast('scrollIntoView');
				return;
			}
			$scope.scrollTop = $(window).scrollTop();
			$rootScope.$broadcast('startReplyingAd');
			$scope.ad = ad;
			$scope.ad.profileUrl = ad.author._type === 'Community' ? 'community' : 'profile';
			$scope.reply = {
				id: ad._id,
				message: '',
				agreed: true
			};
			$location.search('id', ad._id);
			return $scope.agreeTranslationData = {
				name: (_ref = ad.author) != null ? _ref.name : void 0
			};
		};
		$scope.replyToAd = function() {
			if (!$scope.reply.message || $scope.reply.message.length < 3) {
				this.errors = new ResponseErrors({
					status: 400,
					data: {
						name: 'ValidationError',
						message: 'ERR_REPLY_EMPTY_MESSAGE'
					}
				});
				return;
			}
			if (($scope.reply.agreed != null) && $scope.reply.agreed === false) {
				this.errors = new ResponseErrors({
					status: 400,
					data: {
						name: 'ValidationError',
						message: 'ERR_REPLY_PLEASE_AGREE'
					}
				});
			}
			if (!this.replyForm.$valid) {
				return;
			}
			$scope.replyToAdSubmitting = true;
			return PostsService.reply($scope.reply).then(function() {
				$scope.replyToAdSubmitting = false;
				$scope.replyToAdSubmitted = true;
			}).then(null, function() {
				delete this.errors;
				$scope.replyToAdSubmitting = false;
				return $scope.replyToAdSubmitting;
			});
		};
		$scope.removeAd = function(wish) {
			var event;
			if (window.confirm($translate('AD_REMOVE_ARE_YOU_SURE'))) {
				event = wish.type === 'need' ? 'delete wish' : 'delete offer';
				$analytics.eventTrack(event, {
					category: 'Posting',
					label: 'NP'
				});
				return PostsService.remove(wish).then(function() {
					$rootScope.$broadcast('removePost', wish._id);
					$scope.flash.success = $translate('AD_REMOVE_DONE');
					return $scope.flash.success;
				}).then(null, function() {
					$scope.flash.error = $translate('AD_REMOVE_CANNOT_BE_REMOVED');
					return $scope.flash.error;
				});
			}
		};

		$scope.setActive = function(item, isActive) {
			item.is_active = isActive;
			PostsService.update(item);
		};

		$scope.setLastAddedId = function(id) {
			$scope.lastAddedId = id;
			return $scope.lastAddedId;
		};

		$scope.getLastAddedId = function() {
			return $scope.lastAddedId;
		};
		$scope.escapeKey = function($event) {
			if ($event.keyCode === 27) {
				$rootScope.$broadcast('cancelReplyingAd');
				$rootScope.$broadcast('cancelCreatingAd');
				return $rootScope.$broadcast('cancelEditingAd');
			}
		};
		$scope.routeParamsAdIsNotNull = function() {
			return ($location.search().id != null) && $location.search().id;
		};
		$scope.sidebarVisible = function(val) {
			if (val != null) {
				$scope.sidebarIsVisible = val;
			}
			return $scope.sidebarIsVisible;
		};
		$scope.dismissNotification = function(notification) {
			if ($scope.notifications[notification]) {
				$scope.notifications[notification] = false;
				return ipCookie(notification, false);
			}
		};
		$scope.checkNotifications = function() {
			if (ipCookie('newCommunityCreated') === true) {
				$scope.notifications.newCommunityCreated = true;
				return ipCookie('newCommunityCreated', false);
			}
		};

		$scope.isScrolled = false;
		angular.element($window).bind("scroll", function($event) {
			if ($(window).scrollTop() > 0 !== $scope.isScrolled) {
				$('html').toggleClass('scrolled');
				$scope.isScrolled = !$scope.isScrolled;
			}
		});

		return $scope.checkNotifications;
	}
]);