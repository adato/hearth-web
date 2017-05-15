'use strict';
/**
 * @ngdoc directive The selector for the fancybox anchor element has to be unique for the images group.
 * Set the same selector id into the rel parameter just for each anchor, which should be in the same group.
 * OR - just add attribute 'simple' and go with selector 'fancybox without any configuration'
 * @name hearth.directives.fancybox
 * @description Add fancybox page preview
 * @restrict A
 */
angular.module('hearth.directives').directive('fancybox', [
	'$compile', '$timeout',
	function($compile, $timeout) {
		return {
			link: function($scope, element, attrs) {
				if (typeof $().fancybox !== 'function') return console.error('JQuery module fancybox has failed to load.')

				var config = {
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
				};
				var selector = 'a[rel=' + attrs.fancybox + ']';

				if (attrs.simple !== void 0) {
					selector = '.fancybox';
					config = {
						padding: 0
					};
				}

        $(element).find(selector).fancybox(config);
			}
		}
	}
]);