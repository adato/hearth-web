'use strict';

/**
 * @ngdoc service
 * @name hearth.services.KeywordsService
 * @description
 */

angular.module('hearth.services').service('KeywordsService', [
	'$q', 'Keywords',
	function($q, Keywords) {
		this.listKeywords = function() {
			var deferred = $q.defer();

			Keywords.get({
				'keyword': ''
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		this.queryKeywords = function($query) {
			var deferred;
			deferred = $q.defer();
			if ($query !== undefined) {
				$query = ($query + "").toLowerCase();
			}
			Keywords.get({
				'keyword': $query
			}, function(data) {
				var retData = [];
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