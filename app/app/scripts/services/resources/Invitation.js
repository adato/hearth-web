'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Invitation
 * @description
 */

angular.module('hearth.services').factory('Invitation', [
	'$resource',

	function($resource) {

		var addParams = {};
		addParams[$$config.referrerCookieName] = '@refs';

		return $resource($$config.apiPath + '/invitation', {}, {
			add: {
				method: 'POST',
				errorNotify: {
					code: 'NOTIFY.EMAIL_INVITATION_FAILED',
					container: ".invite-box-notify"
				},
				params: addParams

			},
			check: {
				method: 'GET',
				params: {
					email: '@email'
				},
				errorNotify: false
			},
			getReferralCode: {
				method: 'POST',
				url: $$config.apiPath + '/invitation/referral'
			}
		});
	}
]);