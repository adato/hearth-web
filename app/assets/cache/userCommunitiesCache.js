'use strict';

/** Cache for myCommunities (with details fetched separately) 
 *
*/
angular.module('hearth').factory('UserCommunitiesCache', ['$cacheFactory', function($cacheFactory) {
	return $cacheFactory('userCommunities');
}]);