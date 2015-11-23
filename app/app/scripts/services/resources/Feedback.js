'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Feedback
 * @description
 */

angular.module('hearth.services').factory('Feedback', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/feedback', {}, {
			add: {
				method: 'POST'
			}
		});
	}
]);
