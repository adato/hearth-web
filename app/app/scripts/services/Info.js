'use strict';

angular.module('hearth.services').factory('Info', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/info', {}, {
			show: {
				method: 'GET'
			}
		});
	}
]);