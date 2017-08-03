'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Session
 * @description
 */

angular.module('hearth.services').factory('Session', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/session', {}, {
			get: {
				method: 'GET',
				params: {
					r: Math.random()
				}
			},
			updateLanguage: {
				method: 'PUT',
				errorNotify: {
					code: 'SETTINGS.NOTIFY.ERROR_CHANGE_LANGUAGE'
				}
			}
		});
	}
]);