'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.marketplaceBanner
 * @description Creates banner on marketplace screen (on top), unless is discarded by user
 * @restrict A
 */
angular.module('hearth.directives').directive('marketplaceBanner', ['$rootScope',
	function($rootScope) {
		return {
			restrict: 'E',
			scope: {
				'code': '@',
				'image': '@',
				'title': '@?',
				'href': '@?',
				'language': '@',
				'restrictLanguage': '=?',
				'target': '@?'
			},
			templateUrl: 'assets/components/marketplaceBanner/marketplaceBanner.html',
			link: function(scope, element, attrs) {
				scope.closed = $.cookie(scope.code) || false;
				scope.title = scope.title || '';
				scope.href = scope.href || false;
				scope.style = {
					'background-image': scope.image
				};
				scope.close = function($event) {
					scope.closed = !scope.closed;
					$.cookie(scope.code, scope.closed, {
						path: '/',
						expires: 99999
					});
					$event.stopPropagation();
					$event.preventDefault();
				}
			}
		};
	}
]);