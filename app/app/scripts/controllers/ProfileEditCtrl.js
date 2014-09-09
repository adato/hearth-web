'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('ProfileEditCtrl', [
	'$scope', 'Auth', '$route', 'User', 'flash', 'Errors', '$routeParams', '$location', 'UsersService', '$rootScope', '$timeout', '$window', '$translate', '$analytics', '$q', 'ResponseErrors', 'ProfileProgress', 'Facebook',

	function($scope, Auth, $route, User, flash, Errors, $routeParams, $location, UsersService, $rootScope, $timeout, $window, $translate, $analytics, $q, ResponseErrors, ProfileProgress, Facebook) {
		$scope.loaded = false;
		$scope.sending = false;
		$scope.profile = false;
		$scope.showError = {
			locations: false,
		};

		$scope.languageListDefault = ['en', 'de', 'fr', 'ru', 'es', 'cs'];
		$scope.languageList = ['en', 'de', 'fr', 'ru', 'es', 'cs', 'pt', 'ja', 'tr', 'it', 'uk', 'el', 'ro', 'eo', 'hr', 'sk', 'pl', 'bg', 'sv', 'no', 'fi', 'tk', 'ar', 'ko', 'zh'];

		$scope.transformDataIn = function(data) {

			if (!data.webs || !data.webs.length) {
				data.webs = [''];
			}
			if (!data.locations || !data.locations.length) {
				data.locations = [{
					name: ''
				}];
			}

			$scope.languageList.forEach(function(item) {

				if(!data.user_languages[item]) {
					data.user_languages[item] = false;
				}
			});

			$scope.showContactMail = data.contact_email && data.contact_email != '';

			return data;
		};

		$scope.init = function() {
			if (!$rootScope.loggedUser) {
				$route.repload("#!/");
			}

			// $scope.initLocations();
			User.get({
				user_id: $rootScope.loggedUser._id
			}, function(res) {
				$scope.profile = $scope.transformDataIn(res);
				$scope.loaded = true;

			}, function(res) {});
		};

		$scope.avatarUploadFailed = function(err) {

			$scope.uploadingInProgress = false;
		};

		$scope.avatarUploadStarted = function(argument) {
			$scope.uploadingInProgress = true;
		};

		$scope.avatarUploadSucceeded = function(event) {
			$scope.profile.avatar = angular.fromJson(event.target.responseText);
			$scope.uploadingInProgress = false;
		};

		$scope.updateUrl = function($event, model, key) {
			var input = $($event.target),
				url = input.val();
			if (url && !url.match(/http[s]?:\/\/.*/))
				url = 'http://' + url;
			model[key] = url;
		};

		$scope.switchLanguage = function(lang) {
			console.log(lang);
			$scope.profile.user_languages[lang] = !$scope.profile.user_languages[lang];
		};

		$scope.update = function() {

			console.log($scope.profile);

			if($scope.sending)
				return false;

			$scope.sending = true;
			
			User.edit($scope.profile, function(res) {

				console.log(res);
				$scope.sending = false;
			}, function(res) {

				console.log(res);
				$scope.sending = false;
			});

		}

		$scope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();

	}
]);