'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.ad
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('ad', [

	function() {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			scope: {
				item: '='
			},
			templateUrl: 'templates/item.html',
			link: function(scope) {
				scope.edit = false;
				scope.message = '';	

				scope.sendReply = function() {
					scope.$emit('sendReply');
				};
			}

		};
	}
]);