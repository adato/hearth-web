'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Facebook
 * @description
 */

angular.module('hearth.services').service('Facebook', [
	'$translate', 'appConfig',
	
	function($translate, appConfig) {
		var inited = false;

		this.init = function() {

			if (!inited) {
				FB.init({
					appId: appConfig.fbAppId,
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
				message: $translate('HOMEPAGE_HEADING')
			});
		};

		this.init();
		return this;
	}
]);