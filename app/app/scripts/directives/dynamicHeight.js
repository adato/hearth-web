'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.dynamicHeight
 * @description Makes element autoresizing based on current window height
 * @restrict A
 */
angular.module('hearth.directives').directive('dynamicHeight',
	['$timeout',
	function( $timeout ) {
		return {
			restrict: 'A',
			scope: {
				minHeight: '=?',
				offset: '=?',
				container: '@?',
			},
			link: function(scope, element, attrs) {
				scope.minHeight = scope.minHeight || 200;
				function resizeElement() {
					var height = $(scope.container || window).height() - parseInt(scope.offset);
					$(element).height((height < scope.minHeight) ? scope.minHeight : height);
				}
				
				$timeout(resizeElement);
				$(window).resize(resizeElement);
				
				scope.$on('$destroy', function () {
					$(window).unbind('resize',resizeElement);
				});
			}
		};
	}]
);
