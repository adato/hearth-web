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
					// console.log('session', session);
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
			setToken: function(token) {
				$.cookie(TOKEN_NAME, token, {
					expires: 30 * 12 * 30,
					path: '/'
				});
			},
			isLoggedIn: function() {
				return $rootScope.user.loggedIn;
			},
      getUserLanguages: function () {
        return this.isLoggedIn() ? $rootScope.loggedUser.user_languages.join(',') : $rootScope.language;
      },
			getCredentials: function() {
				return $rootScope.user.get_logged_in_user || {
					_id: null
				};
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