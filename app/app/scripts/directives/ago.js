'use strict';

/**
 * @ngdoc service
 * @name hearth.directives.ago
 * @description This will show time from now in words and refresh it periodically
 */

angular.module('hearth.directives').directive('ago', [
	'$interval', '$translate', 'timeAgoService', '$rootScope',
	function($interval, $translate, timeAgoService, $rootScope) {
		return {
			restrict: 'A',
			scope: {
				ago: '=',
			},
			template: '<span>{{timeAgo}}</span>',
			link: function(scope, element, attrs) {
				var eventListener = null;
				scope.timeAgo = null;

				function ago() {
					scope.timeAgo = timeAgoService.inWords(timeAgoService.nowTime - Date.parse(scope.ago));
				}

				scope.$watch('ago', ago); // translate time on init
				eventListener = $rootScope.$on("hearthbeat", ago); // periodically refresh 

				scope.$on('$destroy', function() {
					eventListener(); // remove listener
				});
			}
		};
	}
]);
