'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.dontJumpTop
 * @description This will prevent jumping on top of the page when clicking on link
 * @restrict E
 */
angular.module('hearth.directives').directive('dontJumpTop', [
	'$rootScope',
	function($rootScope) {
		return {
			restrict: 'A',
			link: function(scope, element) {
				$(element).on("click", function() {
					$rootScope.dontScrollTopAfterPageChange();
				});
			}
		};
	}
]);