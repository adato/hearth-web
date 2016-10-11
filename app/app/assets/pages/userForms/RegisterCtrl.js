'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.RegisterCtrl
 * @description
 */

angular.module('hearth.controllers').controller('RegisterCtrl', [
	'$scope', '$rootScope', '$stateParams', 'LanguageSwitch', 'User', 'ResponseErrors', '$analytics', 'Auth', '$location', 'Email', 'Notify', '$auth', '$window', 'RubySerializer', '$http',
	function($scope, $rootScope, $stateParams, LanguageSwitch, User, ResponseErrors, $analytics, Auth, $location, Email, Notify, $auth, $window, RubySerializer, $http) {

		$scope.user = {
			email: '',
			first_name: '',
			last_name: '',
			password: ''
		};
		$scope.sent = false; // show result msg
		$scope.sending = false; // lock - send user only once
		$scope.termsPath = false;
		$scope.params = $stateParams;
		$scope.apiErrors = {};
		$scope.showError = {
			topError: false,
			first_name: false,
			email: false,
			password: false,
		};

		$scope.twitterAuthUrl = Auth.getTwitterAuthUrl('register');

		$scope.oauthRegister = function(provider) {
			// switch serializer for this call to allow unencoded brackets
			var serializer = $http.defaults.paramSerializer;
			$http.defaults.paramSerializer = RubySerializer;

			$auth.authenticate(provider, {
				language: preferredLanguage,
				user_action: 'register'
			}).then(function(response) {
				if (response.status == 200) {
					Auth.processLoginResponse(response.data);
				} else {
					$scope.loginError = true;
				}
				// switch serializer back only after the EP call has responded
				$http.defaults.paramSerializer = serializer;
			});
		};

		$scope.validateData = function(user) {
			var invalid = false;

			// invalidate when requests pending
			if ($scope.registerForm.$pending && $scope.registerForm.$pending.used) {
				invalid = $scope.showError.email = true;
			}

			if ($scope.registerForm.first_name.$invalid) {
				invalid = $scope.showError.first_name = true;
			}

			if ($scope.registerForm.email.$invalid) {
				invalid = $scope.showError.email = true;
			}

			if ($scope.registerForm.password.$invalid) {
				invalid = $scope.showError.password = true;
			}

			return !invalid;
		};

		$scope.hideForm = function() {
			$(".register-login-form").slideUp('slow', function() {});
			$(".register-successful").slideDown('slow', function() {});
		};

		$scope.sendRegistration = function(user) {

			$scope.registerForm.email.$error.used = false;
			$scope.showError.topError = false;

			// lock - dont send form twice
			if ($scope.sending) return false;
			$scope.sending = true;

			var params = {};
			params[$$config.referrerCookieName + '[]'] = $window.refsArray;

			// switch serializer for this call to allow unencoded brackets
			var serializer = $http.defaults.paramSerializer;
			$http.defaults.paramSerializer = RubySerializer;

			User.add(params, $scope.user, function() {
				$scope.sending = false;

				//     // Notify.addSingleTranslate('NOTIFY.SIGNUP_PROCESS_SUCCESS', Notify.T_SUCCESS);
				//     // $location.path('/');

				$scope.hideForm();

				return $analytics.eventTrack('registration email sent', {
					category: 'registration',
					label: 'registration email sent'
				});

			}, function(err) {
				$scope.sending = false;
				$scope.showError.topError = true;
				$scope.apiErrors = new ResponseErrors(err);
				if ($scope.apiErrors.email)
					$scope.showError.email = true;

				return $analytics.eventTrack('error during registration', {
					category: 'registration',
					label: 'error during registration'
				});
			});

			// switch serializer back immediately after the EP call
			$http.defaults.paramSerializer = serializer;
		};

		$scope.register = function(user) {
			user.language = LanguageSwitch.uses();

			if (!$scope.validateData(user)) return false;
			$scope.sendRegistration(user);
		};

		$scope.init = function() {
			if (Auth.isLoggedIn()) {
				return $location.path($rootScope.referrerUrl || 'profile/' + Auth.getCredentials()._id);
			}

			$scope.termsPath = '/app/locales/' + $rootScope.language + '/terms.html';
		};

		$scope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
	}
]);