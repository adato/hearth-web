'use strict';

/**
 * @ngdoc service
 * @name hearth.services.FulltextService
 * @description
 */

angular.module('hearth.services').service('FulltextService', [
	'Fulltext', '$q',
	function(Fulltext, $q) {
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
		return this;
	}
]);
