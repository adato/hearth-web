'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Auth
 * @description
 */

angular.module('hearth.services').factory('Auth', [
	'$session', '$http', '$rootScope', '$q', 'appConfig',
	function($session, $http, $rootScope, $q, appConfig) {
		return {
			init: function(callback) {
				$rootScope.user = {
					name: '',
					loggedIn: false
				};
				return $session.then(function(session) {
					if (session._id) {
						$rootScope.user = session;
						$rootScope.user.loggedIn = true;
						$rootScope.$broadcast('onUserLogin');
					}
					else {
						$rootScope.$broadcast('unathorizedUserLogin');
					}
					$rootScope.$broadcast('authorize');
					return callback();
				});
			},
			login: function(credentials) {
				return $http.post(appConfig.apiPath + '/login', credentials).then(function(data) {
					$rootScope.user = data.data.user;
					$rootScope.user.loggedIn = true;
					return $rootScope.$broadcast('onUserLogin');
				});
			},
			logout: function() {
				$http.post(appConfig.apiPath + '/logout');
			},
			isLoggedIn: function() {
				return $rootScope.user.loggedIn;
			},
			changePassword: function(password, success) {
				return $http.post(appConfig.apiPath + '/change-password', {
					password: password
				}).success(function(data) {
					return success(data);
				});
			},
			getCredentials: function() {
				return $rootScope.user.get_logged_in_user || {
					_id: null
				};
			},
			getCommunityCredentials: function() {
				return $rootScope.user.active_identity || null;
			},
			getBaseCredentials: function() {
				if ($rootScope.user._id) {
					return {
						_id: $rootScope.user._id,
						name: $rootScope.user.name
					};
				} else {
					return null;
				}
			},
			confirmRegistration: function(hash, success, err) {
				return $http.post(appConfig.apiPath + '/users/confirm_registration', {
					'hash': hash
				}).success(function(data) {
					return success(data);
				}).error(function(data) {
					return err(data);
				});
			},
			requestPasswordReset: function(email) {
				return $http.post(appConfig.apiPath + '/reset-password', {
					email: email
				});
			},
			resetPassword: function(token, password, success, err) {
				return $http.put(appConfig.apiPath + '/reset-password', {
					token: token,
					password: password,
					confirm: password
				}).success(function(data) {
					return success(data);
				}).error(function(data) {
					return err(data);
				});
			},
			switchIdentity: function(identity) {
				var defer;
				defer = $q.defer();
				$http.post(appConfig.apiPath + '/sessions/switch_identity/' + identity).success(function(data) {
					return defer.resolve(data);
				}).error(function(data) {
					return defer.reject(data);
				});
				return defer.promise;
			},
			switchIdentityBack: function() {
				var defer;
				defer = $q.defer();
				$http.post(appConfig.apiPath + '/sessions/leave_identity').success(function(data) {
					return defer.resolve(data);
				}).error(function(data) {
					return defer.reject(data);
				});
				return defer.promise;
			}
		};
	}
]);