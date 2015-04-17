'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.autosizeTextarea
 * @description Makes textarea autoresizing based on content
 * @restrict A
 */
angular.module('hearth.directives').directive('classIfOverflow',
	['$timeout',
	function( $timeout ) {
		return {
			restrict: 'A',
			scope: {
				classIfOverflow: "@",
			},
			link: function(scope, element, attrs) {
				// test if inner elements overflows container
            	scope.isOverflow = function() {
            		var height = 0;

					$(element).children('*').each(function() {

					    height += $(this).outerHeight();
					});
					return height > element.height();
            	};

            	scope.toggleClass = function() {
            		if(scope.isOverflow())
            			element.addClass(scope.classIfOverflow);
        			else
        				element.removeClass(scope.classIfOverflow);
            	};

            	$timeout(scope.toggleClass);
				$(window).resize(scope.toggleClass);
			}
		};
	}]
);
