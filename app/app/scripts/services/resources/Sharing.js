'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Sharing
 * @description
 */

angular.module('hearth.services').factory('Sharing', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/post/:id/email_share', {}, {
			emailPost: {
				method: 'POST'
			}
		});
	}
]);