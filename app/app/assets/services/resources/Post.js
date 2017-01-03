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
					code: 'NOTIFY.POST_EDIT_FAILED',
					container: '.edit-post-notify-container'
				},
				transformRequest: [LocationJsonDataTransform.insertLocationJson],
				transformResponse: [LocationJsonDataTransform.getLocationJson]
			},
			update: {
				method: 'PUT',
				errorNotify: {
					code: 'NOTIFY.POST_EDIT_FAILED',
					container: '.edit-post-notify-container'
				},
				transformRequest: [LocationJsonDataTransform.insertLocationJson],
				transformResponse: [LocationJsonDataTransform.getLocationJson]
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
			},
			hide: {
				url: $$config.apiPath + '/posts/:postId/hide',
				method: 'PUT',
				errorNotify: {
					code: 'NOTIFY.POST_HIDE_REPORT_FAILED',
					container: '.notify-report-container'
				}
			},
			uploadAttachment: {
				url: $$config.apiPath + '/posts/:postId/attachments',
				method: 'POST',
				headers: {
					'Content-Type': undefined
				},
				errorNotify: false,
				transformRequest: function(data) {
					var fd = new FormData();
					if (data.file) fd.append('file', data.file);
					return fd;
				}
			},
			announceAttachment: {
				url: $$config.apiPath + '/health', // just any endpoint 
				//url: $$config.apiPath + '/posts/:postId/attachments/presigned',
				method: 'GET',
				errorNotify: false,
				transformResponse: function() {
					// return mock response here
					return {
						"key": "tmp_uploads/b6198f9e-8aed-4e99-ae09-6a6ba2706525/${filename}",
						"success_action_status": "201",
						"acl": "public-read",
						"policy": "eyJleHBpcmF0aW9uIjoiMjAxNy0wMS0wM1QxNDo1NDowMVoiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJoZWFydGgtbmV0LXRvcG1vbmtzLWRldmVsb3BtZW50In0sWyJzdGFydHMtd2l0aCIsIiRrZXkiLCJ0bXBfdXBsb2Fkcy9iNjE5OGY5ZS04YWVkLTRlOTktYWUwOS02YTZiYTI3MDY1MjUvIl0seyJzdWNjZXNzX2FjdGlvbl9zdGF0dXMiOiIyMDEifSx7ImFjbCI6InB1YmxpYy1yZWFkIn0seyJ4LWFtei1jcmVkZW50aWFsIjoiQUtJQUpPNkVOV0JDNzNaV0dPR0EvMjAxNzAxMDMvZXUtd2VzdC0xL3MzL2F3czRfcmVxdWVzdCJ9LHsieC1hbXotYWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsieC1hbXotZGF0ZSI6IjIwMTcwMTAzVDEzNTQwMVoifV19",
						"x-amz-credential": "AKIAJO6ENWBC73ZWGOGA/20170103/eu-west-1/s3/aws4_request",
						"x-amz-algorithm": "AWS4-HMAC-SHA256",
						"x-amz-date": "20170103T135401Z",
						"x-amz-signature": "69fa0f4dd2458f00a4dfb3bb6e27c022f875240583c2a63e90dce11f0d96c78a",
						"url": "https://hearth-net-topmonks-development.s3-eu-west-1.amazonaws.com",
						"host": "hearth-net-topmonks-development.s3-eu-west-1.amazonaws.com"
					};
				}
			}
		});
	}
]);