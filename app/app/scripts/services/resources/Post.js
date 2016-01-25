'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Post
 * @description
 */

angular.module('hearth.services').factory('Post', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/posts/:postId', {
			postId: '@id'
		}, {
			get: {
				nointercept: true,
			},
			query: {
				method: 'GET',
				url: $$config.apiPath + '/search/',
				params: {
					type: 'post'
				},
				nointercept: true,
			},
			emailShare: {
				url: $$config.apiPath + '/posts/:postId/email_share',
				method: 'POST',
				errorNotify: {
					code: 'NOTIFY.EMAIL_SHARING_FAILED',
					container: '.notify-report-container'
				}
			},
			suspend: {
				url: $$config.apiPath + '/posts/:postId/suspend',
				method: 'PUT',
				errorNotify: false // special handler - will open modal window to edit before suspend
			},
			resume: {
				url: $$config.apiPath + '/posts/:postId/resume',
				method: 'PUT',
				errorNotify: false // special handler - will open modal window to edit before resume
			},
			publish: {
				url: $$config.apiPath + '/posts/:postId/publish',
				method: 'PUT'
			},
			prolong: {
				url: $$config.apiPath + '/posts/:postId/prolong',
				method: 'PUT'
			},
			mapQuery: {
				method: 'GET',
				url: $$config.apiPath + '/search/',
				params: {
					type: 'post'
				},
				isArray: true
			},
			createDraft: {
				method: 'POST',
			},
			add: {
				method: 'PUT',
				url: $$config.apiPath + '/posts/:postId/finish',
				errorNotify: {
					code: 'NOTIFY.POST_EDIT_FAILED',
					container: '.edit-post-notify-container'
				}
				// headers: {'Content-Type': 'multipart/form-data'}
			},
			update: {
				method: 'PUT',
				errorNotify: {
					code: 'NOTIFY.POST_EDIT_FAILED',
					container: '.edit-post-notify-container'
				}
				// headers: {'Content-Type': 'multipart/form-data'}
			},
			remove: {
				method: 'DELETE',
				errorNotify: {
					code: 'NOTIFY.POST_DELETED_FAILED',
				}
			},
			communityRemove: {
				url: $$config.apiPath + '/posts/:postId/communities/remove',
				method: 'DELETE',
				errorNotify: {
					code: 'NOTIFY.POST_REMOVE_FROM_COMMUNITY_FAILED',
					container: '.notify-report-container'
				}
			},
			spam: {
				url: $$config.apiPath + '/posts/:postId/spam',
				method: 'PUT',
				errorNotify: {
					code: 'NOTIFY.POST_SPAM_REPORT_FAILED',
					container: '.notify-report-container'
				}
			}
		});
	}
]);