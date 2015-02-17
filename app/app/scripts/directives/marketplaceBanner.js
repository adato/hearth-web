'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.marketplaceBanner
 * @description Creates banner on marketplace screen (on top), unless is discarded by user
 * @restrict A
 */
angular.module('hearth.directives').directive('marketplaceBanner',
	['ipCookie',
	function( ipCookie ) {
		return {
			restrict: 'E',
			scope: false,
			templateUrl: 'templates/directives/marketplaceBanner.html',
			link: function(scope, element, attrs) {
				scope.closed = ipCookie('showMarketplaceBanner') || false;
				scope.close = function () {
					scope.closed = !scope.closed;
					ipCookie('showMarketplaceBanner', scope.closed, { expires: 99999 });
				}
			}
		};
	}]
);
