'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.sharingWindow
 * @description Opens sharing link in smaller window
 * @restrict A
 */
angular.module('hearth.directives').directive('sharingWindow', ['$window',
	function($window) {
		return {
			restrict: 'A',
			scope: false,
			link: function(scope, element, attrs) {
				element.bind('click', function(e) {
					var width = 550;
					var height = 400;
					var left = $window.screenX + (($window.outerWidth - width) / 2);
					var top = $window.screenY + (($window.outerHeight - height) / 2.5);

					window.open(attrs.href, "Share content", "status = 1, width=" + width + ", height=" + height + ", resizable = 0, left=" + left + ",top=" + top);
					e.preventDefault();
					e.stopPropagation();
				})
			}
		};
	}
]);
