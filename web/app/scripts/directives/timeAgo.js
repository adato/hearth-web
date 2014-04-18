'use strict';

angular.module('hearth.directives').directive('timeAgo', [
	'timeAgoService', '$rootScope',
	function(timeago, $rootScope) {
		return {
			replace: true,
			restrict: 'EA',
			scope: {
				'fromTime': '='
			},
			link: {
				post: function(scope, linkElement, attrs) {
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
					scope.$watch('timeago.nowTime-timeago.x(fromTime)', function(value) {
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