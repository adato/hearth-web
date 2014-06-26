'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.editAd
 * @description M
 * @restrict E
 */
angular.module('hearth.directives').directive('editad', [

	function() {
		return {
			replace: true,
			restrict: 'E',
			scope: {},
			templateUrl: 'templates/editItem.html', //must not use name ad.html - adBlocker!
			link: function(scope) {
				scope.post = {
					type: 'offer',
					isPrivate: false
				};

				scope.close = function() {
					scope.$emit('closeNewItem');
				};
			}
		};
	}
]);