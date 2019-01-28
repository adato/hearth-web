'use strict';

/**
 * Cache used for ambassador information
 */

angular.module('hearth').factory('AmbassadorsCache', ['$cacheFactory', function($cacheFactory) {
	return $cacheFactory('ambassadors');
}]);