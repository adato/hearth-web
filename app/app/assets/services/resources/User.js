'use strict';

/**
 * @ngdoc service
 * @name hearth.services.User
 * @description
 */

angular.module('hearth.services').factory('User', [
	'$resource', '$filter', 'LocationJsonDataTransform',
	function($resource, $filter, LocationJsonDataTransform) {
		return $resource($$config.apiPath + '/users/:_id', {
			_id: '@_id'
		}, {
			add: {
				method: 'POST',
				errorNotify: {
					code: 'NOTIFY.SIGNUP_PROCESS_ERROR',
					container: '.register-notify-area'
				}
			},
			get: {
				method: 'GET',
				transformResponse: [LocationJsonDataTransform.getLocationJson]
			},
			getFullInfo: {
				url: $$config.apiPath + '/profile',
				method: 'GET',
				transformResponse: [LocationJsonDataTransform.getLocationJson]
			},
			getReplies: {
				url: $$config.apiPath + '/replies',
				method: 'GET'
			},
			getPosts: {
				url: $$config.apiPath + '/users/:user_id/posts',
				method: 'GET',
				// transformResponse: [LocationJsonDataTransform.getLocationJson.bind({
				// 	prop: 'data'
				// })]
			},
			getConnections: {
				url: $$config.apiPath + '/users/connections',
				method: 'GET'
			},
			confirmRegistration: {
				url: $$config.apiPath + '/users/confirm_registration',
				method: 'POST',
				errorNotify: {
					code: 'NOTIFY.ACCOUNT_ACTIVATE_FAILED'
				}
			},
			edit: {
				method: 'PUT',
				errorNotify: false,
				transformRequest: [LocationJsonDataTransform.insertLocationJson]
			},
			uploadAvatar: {
				method: 'PATCH',
				headers: {
					'Content-Type': undefined
				},
				transformRequest: [function(image) {
					var fd = new FormData();
					fd.append('avatar[file]', image)
					return fd;
				}]
			},
			editSettings: {
				method: 'PUT',
				errorNotify: {
					code: 'NOTIFY.EMAIL_NOTIFY_CONFIG_FAILED'
				}
			},
			remove: {
				method: 'DELETE',
				nointercept: true,
			},
			setClosedFilter: {
				url: $$config.apiPath + '/close_filter',
				method: 'POST'
			},
			removeReminder: {
				method: 'PUT',
				params: {
					used_reminder: '@type'
				}
			},
			resetPassword: {
				url: $$config.apiPath + '/reset_password',
				method: 'PUT',
				errorNotify: {
					code: 'NOTIFY.NEW_PASS_FAILED',
					container: '.reset-pass-notify-container'
				}
			},
			resendActivationEmail: {
				url: $$config.apiPath + '/users/resend_confirmation',
				method: 'POST',
				errorNotify: {
					code: 'NOTIFY.REACTIVATING_EMAIL_FAILED'
				}
			},
			login: {
				url: $$config.apiPath + '/login',
				method: 'POST',
				nointercept: true
			},
			completeEmailForRegistration: {
				url: $$config.apiPath + '/users/email_for_token',
				method: 'PUT',
				errorNotify: {
					code: 'NOTIFY.COMPLETE_TWITTER_REGISTRATION_FAILED',
					container: '.fill-email-notify-container'
				}
			},
			updateFilter: {
				method: 'PATCH',
				errorNotify: {
					code: 'NOTIFY.USER_PROFILE_CHANGE_FAILED'
				},
			}

		});
	}
]);