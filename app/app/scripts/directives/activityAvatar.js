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
				'item': '=',

			},
			template: '<span><avatar class="left" size="small" type="avatarType" src="src"></avatar></span>',
			link: function($scope, el, attrs) {
				$scope.src = null;
				$scope.avatarType = ($scope.item.target_object && $scope.item.verb == "new_rating") ? $scope.item.target_object._type : 'User';

				$scope.$watch('item', function(val) {
					if(val.target_object && val.target_object.avatar  && val.verb == "new_rating")
						$scope.src = val.target_object.avatar.normal;
					
					else if(val.object.avatar)
						$scope.src = val.object.avatar.normal;

					else if($$config.activitiesIcons[val.verb])
						$scope.src = "images/icons/"+$$config.activitiesIcons[val.verb]+".png";

					else
						$scope.src = null;
				});
			}
		};
	}
]);