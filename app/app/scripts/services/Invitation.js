'use strict';

angular.module('hearth.services').factory('Invitation', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/invitation', {}, {
			add: {
				method: 'POST'
			}
		});
	}
]);