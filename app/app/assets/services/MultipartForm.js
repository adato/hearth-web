'use strict';

/**
 * @ngdoc service
 * @name hearth.services.MultipartForm
 * @description File upload service
 */

angular.module('hearth.services').service('MultipartForm', [
	'$http',
	function($http) {
		this.post = function(uploadUrl, data, file) {
			var fd = new FormData();

			if (file) {
				fd.append('feedback[attachments_attributes][][multipart]', file);
			}

			angular.forEach(data, function(key, value) {
				fd.append('feedback[' + value + ']', key);
			});

			return $http.post(uploadUrl, fd, {
				withCredentials: false,
				headers: {
					'Content-Type': undefined
				},
				transformRequest: angular.identity
			});
		}
	}
]);