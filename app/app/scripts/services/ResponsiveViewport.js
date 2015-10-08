'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ResponsiveViewport  
 * @description Helper class for supplying FE with info about current media query set
 */

angular.module('hearth.services').factory('ResponsiveViewport', function() {
	return function(res) {
		var ResponsiveViewport = {};
		var isEnabled = false;

		if (!Foundation) throw new Exception('Foundation not found');

		ResponsiveViewport.isSmall = function () {
			var ret;
			if (Foundation.utils && Foundation.utils.is_small_only) 
				ret = Foundation.utils.is_small_only();
			else if (Foundation.match) 
				ret = Foundation.match(Foundation.media_queries.small).matches && !Foundation.match(Foundation.media_queries.medium).matches;
			else
				ret = window.matchMedia(Foundation.media_queries.small).matches && !window.matchMedia(Foundation.media_queries.medium).matches;
			return ret;
		}
		return ResponsiveViewport;
		
	};
});