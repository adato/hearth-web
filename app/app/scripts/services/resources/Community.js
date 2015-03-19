'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Community
 * @description 
 */
 
angular.module('hearth.services').factory('Community', [
	'$resource',
	
	function($resource) {
		return $resource($$config.apiPath + '/communities/:_id', {}, {
			get: {
				method: 'GET',
				params: {
					r: Math.random()
				}
			},
			query: {
				method: 'GET',
				isArray: true,
				params: {
					r: Math.random()
				}
			},
			getPosts: {
				url: $$config.apiPath + '/communities/:communityId/posts',
				method: 'GET'
			},
			edit: {
				method: 'PUT'
			},
			remove: {
				method: 'DELETE'
			},
			add: {
				method: 'POST'
			},
			random: {
				method: 'GET',
				isArray: true,
				params: {
					r: Math.random()
				}
			}
		});
	}
]);