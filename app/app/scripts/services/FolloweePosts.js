'use strict';

/**
 * @ngdoc service
 * @name hearth.services.FolloweePosts
 * @description 
 */
  
angular.module('hearth.services').factory('FolloweePosts', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/users/:userId/followees/posts', {
			userId: '@userId'
		}, {
			query: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);