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
					code: 'NOTIFY.EMAIL_INVITATION_FAILED',
					container: ".invite-box-notify"
				}
			},
			check: {
				method: 'GET',
				params: {
					email: '@email'
				}
			}
		});
	}
]);