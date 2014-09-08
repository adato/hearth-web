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

			return data;
		}

		$scope.init = function() {
			if (!$rootScope.loggedUser) {
				$route.repload("#!/");
			}

			User.get({
				user_id: $rootScope.loggedUser._id
			}, function(res) {
				$scope.profile = $scope.transformDataIn(res);
				$scope.loaded = true;

			}, function(res) {});
		};

		$scope.avatarUploadSucceeded = function (status, res) {
			
			console.log(status);
			$scope.profile.avatar = res;
		}
		$scope.updateUrl = function($event, model, key) {
			var input = $($event.target),
				url = input.val();
			if (url && !url.match(/http[s]?:\/\/.*/))
				url = 'http://' + url;
			model[key] = url;
		};

		$scope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();

	}
]);