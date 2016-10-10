'use strict';

/**
 * @ngdoc service
 * @name hearth.services.TermsAgreement
 * @description
 */

angular.module('hearth.services').factory('TermsAgreement', [
	'$q', '$location',
	function($q, $location) {
		var isTermsErrorResponse;
		isTermsErrorResponse = function(response) {
			return response.status === 403 && response.data.reason === 'not-agreed-with-terms';
		};
		return function(promise) {
			return promise.then(function(response) {
				return response;
			}, function(response) {
				if (!isTermsErrorResponse(response)) {
					return $q.reject(response);
				}
				$location.path('/terms');
				return $q.reject(response);
			});
		};
	}
]);