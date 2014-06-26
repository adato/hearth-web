'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.feedback
 * @description 
 * @restrict E
 */

angular.module('hearth.directives').directive('feedback', function() {
	return {
		restrict: 'E',
		replace: true,
		template: '<div class="ratings-bar large-centered">' + '<i class="hearthicon-appreciate"></i>' + '<div class="ratio">' + '<div class="thumb-ups" ng-style="ratio" title="{{ up_votes }}"></div>' + '<div class="thumb-downs" title="{{ down_votes }}"></div>' + '</div>' + '<i class="hearthicon-hate right"></i>' + '</div>',
		link: function(scope, el, attrs) {
			var recompute;
			recompute = function() {
				var ratio;
				ratio = (100 / (scope.up_votes + scope.down_votes)) * scope.down_votes;
				scope.ratio = {
					right: ratio + '%'
				};
			};
			scope.$watch(attrs.up_votes, function(newval) {
				if (newval >= 0) {
					scope.up_votes = newval;
					return recompute();
				}
			});
			return scope.$watch(attrs.down_votes, function(newval) {
				if (newval >= 0) {
					scope.down_votes = newval;
					return recompute();
				}
			});
		}
	};
});