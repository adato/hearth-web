'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.fileUpload
 * @description 
 * @restrict A
 */

angular.module('hearth.directives').directive('maxLenCounter', [
	function() {
		return {
			transclude: false,
			restrict: 'E',
			scope: {
				maxLen: "=",
				value: "=",
			},
			template: '<div>' + "<div class='tright len-counter' translate='WRITTEN_FROM_ALLOWED' translate-values='{maxLen: maxLen, len: len}' }}</div>" + '</div>',
			link: function($scope, el, attrs) {
				$scope.maxLen = $scope.maxLen || 300;
				$scope.len = 0;

				$scope.$watch("value", function(val) {
					if (val)
						$scope.len = val.length;
					else
						$scope.len = 0;
				});
			}
		};
	}
]);
