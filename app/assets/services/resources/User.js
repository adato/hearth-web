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
					code: 'AUTH.NOTIFY.ERROR_REGISTER',
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
				method: 'GET'
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
					code: 'AUTH.NOTIFY.ERROR_ACTIVATE_ACCOUNT'
				}
			},
			resendConfirmation: {
				url: $$config.apiPath + '/users/resend_confirmation',
				method: 'POST'
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
					fd.append('avatar[file]', image);
					return fd;
				}]
			},

			// function to use to get presigned url for amazon direct upload
			// resolves a json with
			//  * url to upload images to
			//  * presigned time-limited key that allows the upload
			//  * other information required by aws enabling the upload
			announceAvatarUpload: {
				url: $$config.apiPath + '/users/avatar/presigned',
				method: 'POST',
				errorNotify: false
			},

			editSettings: {
				method: 'PUT',
				errorNotify: {
					code: 'SETTINGS.NOTIFY.ERROR_EMAIL_NOTIFY_CONFIG'
				}
			},
			remove: {
				method: 'DELETE',
				nointercept: true
			},
			setClosedFilter: {
				url: $$config.apiPath + '/close_filter',
				method: 'POST'
			},
			checkResetPasswordToken: {
				method: 'GET',
				url: $$config.apiPath + '/users/check_reset_password_token',
				errorNotify: false
			},
			requestPasswordReset: {
				url: $$config.apiPath + '/reset_password',
				method: 'POST',
				errorNotify: {
					code: 'AUTH.NOTIFY.ERROR_RESET_PASSWORD',
					container: '.forgot-pass-notify-container'
				}
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
					code: 'AUTH.NOTIFY.ERROR_RESET_PASSWORD',
					container: '.reset-pass-notify-container'
				}
			},
			resendActivationEmail: {
				url: $$config.apiPath + '/users/resend_confirmation',
				method: 'POST',
				errorNotify: {
					code: 'AUTH.NOTIFY.ERROR_RESEND_EMAIL'
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
					code: 'AUTH.NOTIFY.ERROR_TWITTER_REGISTRATION',
					container: '.fill-email-notify-container'
				}
			},
			updateFilter: {
				method: 'PATCH',
				errorNotify: {
					code: 'PROFILE.EDIT.NOTIFY.ERROR_SAVE_PROFILE'
				}
			},
			logout: {
				method: 'POST',
				url: $$config.apiPath + '/logout'
			},
			setProperties: {
				method: 'PUT',	
			}

		});
	}
]);