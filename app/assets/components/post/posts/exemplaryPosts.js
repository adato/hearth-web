'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.item
 * @description Show exemplary posts
 * @restrict E
 */
angular.module('hearth.directives').directive('exemplaryPosts', [
	function() {
		return {
			restrict: 'E',
			replace: true,
      transclude: true,
			scope: {
				opts: '=',
			},
			templateUrl: 'assets/components/item/items/exemplaryPosts.html',
			link: function(scope, element) {
			}
		};
	}
]);
