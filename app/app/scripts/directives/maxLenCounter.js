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
			transclude: 'element',
			replace: true,
			restrict: 'EA',
			scope: {
				maxLen: "="
			},
			template: '<div>' + '<span ng-transclude></span>' + "<div class='tright len-counter' translate='WRITTEN_FROM_ALLOWED' translate-values='{maxLen: maxLen, len: len}' }}</div>" + '</div>',
			link: function($scope, el, attrs) {
				var element = $("textarea, input", el);

				$scope.maxLen = $scope.maxLen || 300;
				$scope.len = 0;

				function recountLen(applyScope) {
					$scope.len = element.val().length;
					if(!$scope.$$phase && applyScope !== false) {
						$scope.$apply();
					}
				}

				element.keydown(recountLen);
				element.change(recountLen);
				element.keyup(recountLen);
				recountLen(false);
			}
		};
	}
]);