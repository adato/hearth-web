'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.dropdown
 * @description 
 * @restrict E
 */

angular.module('hearth.directives').directive('dropdown', [
	'$document',
	function($document) {
		return {
			restrict: 'A',
			replace: false,
			scope: {
				dropdown: "@", // class or id of element to show/hide
				hover: "=" // show/hide dropdown also on hover event
			},
			link: function($scope, el, attrs) {
				var target;

				// get target element to show/hide 
				function getTarget() {
					if (target)
						return target;
					return target = $document.find($scope.dropdown);
				}

				// display targeted element and hide others dropdowns
				function show() {
					$document.find(".dropdown").css("display", "none");
					getTarget().css("display", "block");
				}

				// hide targeted element
				function hide() {
					getTarget().css("display", "none");
				}

				// on element click toggle dropdown
				el.on('click', function($event) {

					$event.stopPropagation();
					getTarget().css("display") == 'block' ? hide() : show();
				});

				if ($scope.hover) {
					el.parent().on('mouseenter', show);
					el.parent().on('mouseleave', hide);
				}

				// when clicked somewhere else, hide dropdown
				$document.on("click", hide);

				// when changed target - delete cached value
				$scope.$watch("dropdown", function(val) {
					target = null;
				});

				$scope.$on('$destroy', function() {
					$document.off('click', hide);
				})
			}
		}
	}
]);
