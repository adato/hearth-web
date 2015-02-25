'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.avatar
 * @description 
 * @restrict E
 */

angular.module('hearth.directives').directive('activityAvatar', [
	function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				'type': '=',
			},
			template: '<span><avatar class="left" size="small" src="src"></avatar></span>',
			link: function($scope, el, attrs) {
				$scope.src = null;

				$scope.$watch('type', function(val) {
					if($$config.activitiesIcons[val])
						$scope.src = "images/icons/"+$$config.activitiesIcons[val]+".png";
					else
						$scope.src = null;
				});
			}
		};
	}
]);