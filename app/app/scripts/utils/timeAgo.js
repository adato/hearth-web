'use strict';

/**
 * @ngdoc directive
 * @name hearth.utils.timeAgo
 * @description
 * @restrict EA
 */

angular.module('hearth.utils').directive('timeAgo', [
	'timeAgoService', '$rootScope',
	function(timeago, $rootScope) {
		return {
			replace: true,
			restrict: 'EA',
			scope: {
				'fromTime': '='
			},
			link: {
				post: function(scope, linkElement) {
					scope.process = function() {
						var value;
						if (scope.timeago.nowTime != null) {
							value = scope.timeago.nowTime - timeago.x(scope.fromTime);
							if (value) {
								return linkElement.text(scope.timeago.inWords(value));
							}
						}
					};
					scope.timeago = timeago;
					scope.timeago.init();
					scope.$watch('timeago.nowTime-timeago.x(fromTime)', function() {
						return scope.process();
					});
					return $rootScope.$on('$translateChangeSuccess', function() {
						return scope.process();
					});
				}
			}
		};
	}
]);