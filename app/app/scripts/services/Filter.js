'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Filter
 * @description
 */

angular.module('hearth.services').factory('Filter', [
	'$q', '$location', '$rootScope', 'User', 'KeywordsService', 'Post',
	function($q, $location, $rootScope, User, KeywordsService, Post) {
		return {
			_commonKeywords: [],
			getCommonKeywords: function(cb) {
				var self = this;
				cb = cb || function() {};

				if (this._commonKeywords.length)
					return cb(this._commonKeywords);
				else
					KeywordsService.queryKeywords().then(function(res) {
						cb(self._commonKeywords = res);
					});
			},
			queryCommonKeywords: function($query) {
				var deferred = $q.defer();
				deferred.resolve(this._commonKeywords);
				return deferred.promise;
			},
			toggleTag: function(tag) {
				var params, index;

				params = $location.search();
				params.keywords = params.keywords || [];

				if (!$.isArray(params.keywords))
					params.keywords = params.keywords.split(",");

				index = params.keywords.indexOf(tag);
				if (index == -1)
					params.keywords.push(tag);
				else {
					params.keywords.splice(index, 1);
				}

				params.keywords = params.keywords.join(",");
				if (params.keywords == "")
					delete params.keywords;

				$location.search(params);
				$rootScope.$broadcast("filterApplied", params);
			},
			getActiveTags: function() {
				var params = $location.search();

				if (!params.keywords)
					return [];

				if (!$.isArray(params.keywords))
					return angular.copy(params.keywords).split(",");
				else
					return params.keywords;

			},
			getFilterPostCount: function(filter, cb) {
				filter = filter || {};
				filter.counters = true;

				Post.query(filter, function(res) {
					cb((res.counters && res.counters.post) ? res.counters.post : 0);
				});
			},
			get: function() {
				return $location.search();
			},
			getParams: function() {
				var params = this.get();
				if ($.isArray(params.keywords))
					params.keywords = params.keywords.join(',');

				return $.param(params);
			},
			isSet: function() {
				return !$.isEmptyObject($location.search());
			},
			apply: function(filterData, save, applySave) {

				$location.search(filterData);
				if (applySave && $rootScope.loggedUser._id) {
					if (save) {
						this.setUserFilter(filterData);
					} else {
						this.deleteUserFilter();
					}
				}

				$rootScope.$broadcast("filterApplied", filterData);
			},
			checkUserFilter: function() {
				// if user has saved filter, load it
				if ($rootScope.user && $rootScope.user.filter && Object.keys($rootScope.user.filter).length) {
					this.apply($rootScope.user.filter);
				}
			},
			setUserFilter: function(filter) {
				User.edit({
					_id: $rootScope.loggedUser._id,
					filter: filter
				});
				$rootScope.user.filter = filter;
			},
			deleteUserFilter: function() {
				this.setUserFilter({});
			},
			reset: function() {
				$location.search('');

				if ($rootScope.loggedUser._id) {
					this.deleteUserFilter();
				}

				$rootScope.$broadcast("filterReseted");
			}
		};
	}
]);