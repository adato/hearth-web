'use strict';

/** Cache for myCommunities (with details fetched separately) 
 *
*/
angular.module('hearth').factory('InfoBubbleCache', ['$cacheFactory', function($cacheFactory) {
	return $cacheFactory('infoBubbles');
}]);