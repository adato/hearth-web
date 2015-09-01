'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.marketplaceBanner
 * @description Creates banner on marketplace screen (on top), unless is discarded by user
 * @restrict A
 */
angular.module('hearth.directives').directive('marketplaceBanner',
	function() {
		return {
			restrict: 'E',
			scope: false,
			templateUrl: 'templates/directives/marketplaceBanner.html',
			link: function(scope, element, attrs) {
				scope.closed = $.cookie('showTechLeaderBanner') || false;
				scope.close = function () {
					scope.closed = !scope.closed;
					$.cookie('showTechLeaderBanner', scope.closed, { path: '/', expires: 99999 });
				}
			}
		};
	}
);
