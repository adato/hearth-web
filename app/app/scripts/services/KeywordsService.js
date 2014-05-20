'use strict';

angular.module('hearth.services').service('KeywordsService', [
	'$q', 'Keywords',
	function($q, Keywords) {
		this.listKeywords = function() {
			var deferred;
			deferred = $q.defer();

			Keywords.get({}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		this.queryKeywords = function($query) {
			var deferred;
			deferred = $q.defer();
			Keywords.get({
				'keyword': $query
			}, function(data) {
				var retData;
				retData = [];
				data.forEach(function(item) {
					return retData.push(item.term);
				});
				return deferred.resolve(retData);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		return this;
	}
]);