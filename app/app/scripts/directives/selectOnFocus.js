'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.selectOnFocus
 * @description This will select whole content of input/textarea when focused
 * @restrict E
 */
angular.module('hearth.directives').directive('selectOnFocus', [
	'$rootScope',
	function($rootScope) {
		return {
			restrict: 'A',
			link: function(scope, element) {
				$(element).on("click", function () {
				   $(this).select();
				});
			}
		};
	}
]);