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
				bottomOffset: '=?',
			},
			link: function(scope, element, attrs) {
				scope.bottomOffset = scope.bottomOffset || 150;
				scope.minHeight = scope.minHeight || 400;
				function resizeElement() {
					var height = $(window).height() - $(element).offset().top - scope.bottomOffset;
					console.log($(window).height() , $(element).offset(), scope.bottomOffset);

					$(element).height((height < scope.minHeight) ? scope.minHeight : height);
				}

				$timeout(resizeElement);
				$(window).resize(resizeElement);
			}
		};
	}]
);
