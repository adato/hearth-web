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
		template: '<div class="ratings-bar large-centered">' + '<i class="hearthicon-appreciate"></i>' + '<div class="ratio">' + '<div class="thumb-ups" ng-style="ratio" title="{{ upVotes }}"></div>' + '<div class="thumb-downs" title="{{ downVotes }}"></div>' + '</div>' + '<i class="hearthicon-hate right"></i>' + '</div>',
		link: function(scope, el, attrs) {
			var recompute;
			recompute = function() {
				var ratio;
				ratio = (100 / (scope.upVotes + scope.downVotes)) * scope.downVotes;
				scope.ratio = {
					right: ratio + '%'
				};
			};
			scope.$watch(attrs.upVotes, function(newval) {
				if (newval >= 0) {
					scope.upVotes = newval;
					return recompute();
				}
			});
			return scope.$watch(attrs.downVotes, function(newval) {
				if (newval >= 0) {
					scope.downVotes = newval;
					return recompute();
				}
			});
		}
	};
});