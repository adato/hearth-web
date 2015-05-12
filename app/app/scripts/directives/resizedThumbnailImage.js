'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.resizedThumbnailImage
 * @description 
 * @restrict A
 */
angular.module('hearth.directives').directive('resizedThumbnailImage', ['$timeout', function($timeout) {
	return {
		restrict: 'A',
        link: function(scope, element, attrs) {
	        element.bind('load', function() {
	        	$timeout(function () {
			        var aspectRatio = $(this).width()/$(this).height();
			        element.removeClass("landscape portrait");
			        if(aspectRatio > 1) {
			            $(this).addClass("landscape");
			        } else if (aspectRatio < 1) {
						$(this).addClass("portrait");
			        }
			    }, 100);
            });
        }
	};
}]);
