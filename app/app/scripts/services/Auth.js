'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Auth
 * @description
 */

angular.module('hearth.services').factory('Auth', [
	'$session', '$http', '$rootScope', '$q',
	function($session, $http, $rootScope, $q) {
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
					return callback();
				});
			},
			login: function(credentials) {
				return $http.post($$config.apiPath + '/login', credentials).then(function(data) {
					$rootScope.user = data.data.user;
					$rootScope.user.loggedIn = true;
					return $rootScope.$broadcast('onUserLogin');
				});
			},
			logout: function() {
				$http.post($$config.apiPath + '/logout');
			},
			isLoggedIn: function() {
				return $rootScope.user.loggedIn;
			},
			changePassword: function(password, success) {
				return $http.post($$config.apiPath + '/change-password', {
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
				return $http.post($$config.apiPath + '/confirm-registration', {
					'hash': hash
				}).success(function(data) {
					return success(data);
				}).error(function(data) {
					return err(data);
				});
			},
			requestPasswordReset: function(email) {
				return $http.post($$config.apiPath + '/reset-password', {
					email: email
				});
			},
			resetPassword: function(token, password, success, err) {
				return $http.put($$config.apiPath + '/reset-password', {
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
				$http.post($$config.apiPath + '/switch-identity/' + identity).success(function(data) {
					return defer.resolve(data);
				}).error(function(data) {
					return defer.reject(data);
				});
				return defer.promise;
			},
			switchIdentityBack: function() {
				var defer;
				defer = $q.defer();
				$http.post($$config.apiPath + '/leave-identity').success(function(data) {
					return defer.resolve(data);
				}).error(function(data) {
					return defer.reject(data);
				});
				return defer.promise;
			}
		};
	}
]);