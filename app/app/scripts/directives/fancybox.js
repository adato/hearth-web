'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.fancybox
 * @description Add fancybox page preview
 * @restrict A
 */
angular.module('hearth.directives').directive('fancybox', [
	'$compile', '$timeout',
	function($compile, $timeout) {
		return {
			link: function($scope, element, attrs) {
				$(element).find(".fancy").fancybox({
					padding: 0,
					helpers: {
						overlay: {
							locked: false
						}
					},
					hideOnOverlayClick: false,
					hideOnContentClick: false,
					enableEscapeButton: false,
					showNavArrows: false,
					onComplete: function() {
						$timeout(function() {
							$compile($("#fancybox-content"))($scope);
							$scope.$apply();
							$.fancybox.resize();
						})
					}
				});
			}
		}
	}
]);
