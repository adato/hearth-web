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

		this.inviteFriends = function() {
			FB.ui({
				method: 'apprequests',
				message: $translate.instant('FACEBOOK_INVITATION_MESSAGE')
			});
		};

		this.init();
		return this;
	}
]);
