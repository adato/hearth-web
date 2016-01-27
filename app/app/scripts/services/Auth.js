'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Auth
 * @description
 */

angular.module('hearth.services').factory('Auth', [
	'$session', '$http', '$rootScope', '$q', 'LanguageSwitch', '$location', 'Session', 'UnauthReload', 'User',
	function($session, $http, $rootScope, $q, LanguageSwitch, $location, Session, UnauthReload, User) {
		var TOKEN_NAME = "authToken";

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

						if (session.get_logged_in_user && session.get_logged_in_user.location) {
							var loc = session.get_logged_in_user.location;
							$$config.defaultMapLocation = [loc[1], loc[0]];
						}

					} else {
						$rootScope.$broadcast('unathorizedUserLogin');
					}
					$rootScope.$broadcast('authorize');
					return callback();
				});
			},
			refreshUserInfo: function() {
				Session.show(function(res) {
					if (res.get_logged_in_user)
						$rootScope.loggedUser = res.get_logged_in_user;
				});
			},
			login: function(credentials, cb, errCb) {
				User.login(credentials, cb, errCb);
			},
			resendActivationEmail: function(email, cb) {
				return User.resendActivationEmail({
					user: {
						email: email
					}
				}, cb, cb);
			},
			logout: function(cb) {
				return $session.then(function(session) {
					if (session._id) {
						delete session._id
					}
					$http.post($$config.apiPath + '/logout').success(cb).error(cb);
				}, function() {
					$http.post($$config.apiPath + '/logout').success(cb).error(cb);
				});
			},
			setToken: function(token) {
				$.cookie(TOKEN_NAME, token, {
					expires: 30 * 12 * 30,
					path: '/'
				});
			},
			destroyLogin: function() {
				$.removeCookie(TOKEN_NAME, {
					path: $$config.basePath
				});
				$rootScope.user.loggedIn = false;
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
			getSessionInfo: function() {
				return {
					loggedUser: this.getCredentials(),
					loggedEntity: this.getBaseCredentials(),
				}
			},
			confirmRegistration: function(hash, success, error) {
				User.confirmRegistration({
					hash: hash
				}, success, error);
			},
			completeEmailForRegistration: function(data, success, err) {
				User.completeEmailForRegistration(data, success, err);
			},
			requestPasswordReset: function(email) {
				return $http.post($$config.apiPath + '/reset_password', {
					email: email,
				}, {
					errorNotify: {
						code: 'NOTIFY.RESET_PASSWORD_FAILED',
						container: '.forgot-pass-notify-container'
					}
				});
			},
			checkResetPasswordToken: function(token, cb) {
				return $http.get($$config.apiPath + '/users/check_reset_password_token?token=' + token).success(function(res) {
					return cb(res);
				}).error(function(res) {
					return cb(res);
				});
			},
			resetPassword: function(token, password, success, error) {
				User.resetPassword({
					token: token,
					password: password,
					confirm: password
				}, success, error);
			},
			processLoginResponse: function(data) {
				if (data.email_token)
					return $location.path($$config.appUrl + 'fill-email/' + data.email_token);

				// when user logged, use his language configured on API
				if (data.language)
					LanguageSwitch.setCookie(data.language);

				if (data.api_token) {
					this.setToken(data.api_token);
				}

				var reloadLoc = UnauthReload.getLocation();
				UnauthReload.clearReloadLocation();

				$rootScope.refreshToPath(reloadLoc ? $$config.basePath + reloadLoc : $$config.basePath);
			},
			getTwitterAuthUrl: function() {
				var fillEmailUrl = $$config.appUrl + 'fill-email/%{token}';
				var twitterSuccessUrl = $$config.appUrl + 'token-login/%{token}';
				return $$config.apiPath + '/users/auth/twitter?success_url=' + encodeURIComponent(twitterSuccessUrl) + '&email_url=' + encodeURIComponent(fillEmailUrl);
			},
		};
	}
]);