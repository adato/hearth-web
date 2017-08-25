'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Post
 * @description
 */

angular.module('hearth.services').factory('Post', [
	'$resource', 'LocationJsonDataTransform',
	function($resource, LocationJsonDataTransform) {
		return $resource($$config.apiPath + '/posts/:postId', {
			postId: '@id'
		}, {
			get: {
				nointercept: true,
				transformResponse: [LocationJsonDataTransform.getLocationJson]
			},
			query: {
				method: 'GET',
				url: $$config.apiPath + '/search/',
				nointercept: true,
			},
			emailShare: {
				url: $$config.apiPath + '/posts/:postId/email_share',
				method: 'POST',
				errorNotify: {
					code: 'POST.SHARE.BY_EMAIL.NOTIFY.ERROR_SHARE',
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
			follow: {
				url: $$config.apiPath + '/posts/:postId/follow',
				method: 'POST'
			},
			unfollow: {
				url: $$config.apiPath + '/posts/:postId/follow',
				method: 'DELETE'
			},
			mapQuery: {
				method: 'GET',
				url: $$config.apiPath + '/search/',
				params: {
					type: 'post',
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
					code: 'POST.NOTIFY.ERROR_UPDATE',
					container: '.edit-post-notify-container'
				},
				transformRequest: [LocationJsonDataTransform.insertLocationJson],
				transformResponse: [LocationJsonDataTransform.getLocationJson]
			},
			update: {
				method: 'PUT',
				errorNotify: {
					code: 'POST.NOTIFY.ERROR_UPDATE',
					container: '.edit-post-notify-container'
				},
				transformRequest: [LocationJsonDataTransform.insertLocationJson],
				transformResponse: [LocationJsonDataTransform.getLocationJson]
			},
			updateCategories: {
				method: 'PATCH',
				url: $$config.apiPath + '/posts/:postId/categories'
			},
      loadCategories: {
        method: 'GET',
        url: $$config.apiPath + '/posts/categories',
        nointercept: true
      },
			remove: {
				method: 'DELETE',
				errorNotify: {
					code: 'POST.NOTIFY.ERROR_DELETE',
				}
			},
			communityRemove: {
				url: $$config.apiPath + '/posts/:postId/communities/remove',
				method: 'DELETE',
				errorNotify: {
					code: 'POST.REMOVE_FROM_COMMUNITY.ERROR_REMOVE',
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
			},
			hide: {
				url: $$config.apiPath + '/posts/:postId/hide',
				method: 'PUT',
				errorNotify: {
					code: 'POST.NOTIFY.ERROR_UPDATE',
					container: '.notify-report-container'
				}
			},
			getRelated: {
				method: 'GET',
				url: $$config.apiPath + '/posts/:postId/related',
				params: {
					limit: 5,
					offset: 0
				}
			},
      vote: {
        url: $$config.apiPath + '/posts/:postId/related/vote',
        method: 'POST'
      },

			heart: {
				url: $$config.apiPath + '/posts/:postId/hearts',
				method: 'POST'
			},
			unheart: {
				url: $$config.apiPath + '/posts/:postId/hearts',
				method: 'DELETE'
			},

			exemplaryPosts: {
				merthod: 'GET',
				url: $$config.apiPath + '/posts/exemplary'
			},

			createComment: {
				method: 'POST',
				url: $$config.apiPath + '/posts/:postId/comments'
			},
			queryComments: {
				method: 'GET',
				isArray: true,
				url: $$config.apiPath + '/posts/:postId/comments'
			}

		});
	}
]);
