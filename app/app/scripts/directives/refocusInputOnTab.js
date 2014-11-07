'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.scrollTo
 * @description
 */

angular.module('hearth.directives').directive('refocusInputOnTab', [
	'$timeout',
	function($timeout) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				$("input", element).keypress(function(e) {
					if ($(e.target).val() != '' && e.keyCode == 9) {

						e.preventDefault();
						e.stopPropagation();

						$("#searchBox").focus();
						$(this).focus();
					}
				});
			}
		};
	}
]);