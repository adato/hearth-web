'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Communities
 * @description
 */

angular.module('hearth.services').service('Communities', [
	'$q', 'Community', '$rootScope', '$timeout',
	function($q, Community, $rootScope, $timeout) {

		this.query = function($query) {
			var deferred = $q.defer();

			$query = $query.toLowerCase();

			$timeout(function() {
				var retData = [];

				if ($rootScope.myCommunities)
					$rootScope.myCommunities.forEach(function(item) {
						if (!item.name.toLowerCase().indexOf($query))
							return retData.push(item);
					});

				return deferred.resolve(retData);
			});

			return deferred.promise;
		};

		this.getByName = function(name) {
			if ($rootScope.myCommunities)
				for (var i in $rootScope.myCommunities) {
					var item = $rootScope.myCommunities[i];

					if (!item.name.toLowerCase() == name.toLowerCase())
						return item;
				}
			return null;
		};

		return this;
	}
]);
