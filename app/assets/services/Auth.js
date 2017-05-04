'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Auth
 * @description
 */

angular.module('hearth.services').factory('Auth', [
	'$http', '$rootScope', '$q', 'LanguageSwitch', '$location', 'Session', 'UnauthReload', 'User', '$window', 'ConversationAux',
	function($http, $rootScope, $q, LanguageSwitch, $location, Session, UnauthReload, User, $window, ConversationAux) {
		var TOKEN_NAME = "authToken";

		return {
			init: function(done, doneErr) {
				$rootScope.user = {
					name: '',
					loggedIn: false
				};
				return Session.get(session => {
					if (session._id) {
						$rootScope.user = session;
						$rootScope.user.loggedIn = true;
						$.cookie('user_id', session._id);

						// start services that should only run for logged in users
						ConversationAux.init();

						if (session.get_logged_in_user && session.get_logged_in_user.location) {
							var loc = session.get_logged_in_user.location;
							$$config.defaultMapLocation = [loc[1], loc[0]];
						}
					}
					return done();
				}, doneErr);
			},
			refreshUserInfo: function() {
				Session.get(res => {
					if (res.get_logged_in_user) $rootScope.loggedUser = res.get_logged_in_user;
				});
			},
			setOAuth: function(value) {
				$.cookie('logged_in_using_omniauth', value);
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
				return Session.get(session => {
					if (session._id) delete session._id;
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
      getUserLanguages: function () {
        return this.isLoggedIn() ? $rootScope.loggedUser.user_languages.join(',') : $rootScope.language;
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
				return User.completeEmailForRegistration(data, success, err);
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
				if (data.email_token) {
					$window.location.href = $$config.basePath + 'fill-email/' + data.email_token;
					return;
				}

				// when user logged, use his language configured on API
				if (data.language) LanguageSwitch.setCookie(data.language);

				if (data.api_token) this.setToken(data.api_token);

				var reloadLoc = UnauthReload.getLocation();
				UnauthReload.clearReloadLocation();

				return $window.location.replace(reloadLoc || '/app');
			},
			getTwitterAuthUrl: function(method) {
				var fillEmailUrl = $$config.appUrl + 'fill-email/%{token}';
				var twitterSuccessUrl = $$config.appUrl + 'token-login/%{token}';
				var userAction = (method === 'register' ? '&user_action=register' : '');

				return $$config.apiPath + '/users/auth/twitter?success_url=' + $window.encodeURIComponent(twitterSuccessUrl) + '&email_url=' + $window.encodeURIComponent(fillEmailUrl) + userAction + '&' + $window.refsString.slice(1);
			},
		};
	}
]);
