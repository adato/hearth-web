'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Facebook
 * @description
 */

angular.module('hearth.services').service('Facebook', [
	'$translate',

	function($translate) {
		var inited = false;

		this.init = function() {

			if (!inited) {
				FB.init({
					appId: $$config.fbAppId,
					cookie: true,
					status: true,
					xfbml: true
				});
			}
			inited = true;
		};

		this.inviteFriends = function(token) {
			console.log('passing token: ', token);
			FB.ui({
				method: 'apprequests',
				message: $translate.instant('FACEBOOK_INVITATION_MESSAGE'),
				// redirectUri: window.encodeURIComponent(uri)
				data: token
			});
		};

		function fetchIds(request_ids) {
			for (var i = request_ids.length; i--;) {
				$http('https://graph.facebook.com/' + request_ids[i] + '?access_token=' + $$config.fbAppToken, function(res) {
					console.log(res);
				});
			}
			return true;
		}

		this.checkRequestIds = function() {
			var search = window.location.search;
			if (search) {
				var searchItems = search.slice(1).split('&');
				for (var i = searchItems.length; i--;) {
					var item = searchItems[i].split('=');
					if (item[0] === 'request_ids') {
						// request_ids contains a comma separated list of ids that each may (and should) carry an invitation token
						var request_ids = item[1].split(',');
						return fetchIds(request_ids);
					}
				}
			}
			return false;
		};

		this.init();
		return this;
	}
]);