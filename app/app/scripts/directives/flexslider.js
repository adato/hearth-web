'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.flexslider
 * @description Add flexslider to page
 * @restrict A
 */
angular.module('hearth.directives').directive('flexslider', function() {

	return {
		link: function($scope, element, attrs) {

			setTimeout(function() {

				element.flexslider({
					animation: "slide",
					itemWidth: 650,
					itemMargin: 0,
					useCSS: false,
					directionNav: false,
					slideshow: false,
				});
			});
		}
	}
});
