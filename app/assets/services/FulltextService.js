'use strict';

/**
 * @ngdoc service
 * @name hearth.services.FulltextService
 * @description
 */

angular.module('hearth.services').service('FulltextService', [
	'Fulltext', '$q', '$http',
	function(Fulltext, $q, $http) {
		this.query = function(params) {
			var deferred;
			deferred = $q.defer();
			Fulltext.query(params, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		// temporarily placed in this service, possible todo is to move to separate resource
		this.querySearchWords = function(params) {
			var deferred;
			deferred = $q.defer();
			$http.get('https://cms.hearth.net/api/search/list', { withCredentials: false }).then(function (data) {
				if (data && data.data && data.data.response) return deferred.resolve(data.data.response);
				return deferred.reject({ message: "No data returned"});
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		}
		return this;
	}
]);