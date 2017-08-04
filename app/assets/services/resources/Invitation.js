'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Invitation
 * @description
 */

angular.module('hearth.services').factory('Invitation', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/invitation', {}, {
			add: {
				method: 'POST',
				errorNotify: {
					code: 'HEARTH.INVITE.NOTIFY.ERROR_SEND_INVITATION',
					container: ".invite-box-notify"
				}
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