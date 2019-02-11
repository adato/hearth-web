'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.hearth-footer
 * @description adds footer to page
 * @restrict A
 */
angular.module('hearth.directives').directive('flyingFooter', [
	'$rootScope', '$window', '$timeout',
	function($rootScope, $window, $timeout) {
		return {
			restrict: 'E',
			scope: {
				hideIfUnderrunsElement: '='
			},
			templateUrl: 'assets/components/flyingFooter/flyingFooter.html',
			link: function($scope, element) {
				$timeout(function () {
					var stickySidebar = angular.element(element[0].firstChild);
					var underrunElement;

					if (stickySidebar) { 
						var stickyHeight = stickySidebar.height(),
						sidebarTop = stickySidebar.offset().top;
					}

					if ($scope.hideIfUnderrunsElement) {
						underrunElement = angular.element($scope.hideIfUnderrunsElement);
					}
					
					// on scroll move the sidebar
					$window.addEventListener('scroll', function () {
						if (stickySidebar && (!underrunElement || underrunElement && underrunElement.height() > sidebarTop + 300)) {
							element.css('display', 'block');
							var scrollTop = $(window).scrollTop();
							if (sidebarTop < scrollTop + stickyHeight) {
								stickySidebar.css('margin-top', scrollTop - sidebarTop + stickyHeight);
							} else {
								stickySidebar.css('margin-top', '0');
							} 
						} else {
							element.css('display', 'none');
						}
					});
				}, 2000);
			}
		};
	}
]);