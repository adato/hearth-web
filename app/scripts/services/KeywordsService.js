'use strict';

angular.module('hearth.services').service('KeywordsService', [
	'$q', 'Keywords',
	function($q, Keywords) {
		this.listKeywords = function() {
			var deferred;
			deferred = $q.defer();
			Keywords.query({}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		return this;
	}
]);