'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.sharingWindow
 * @description Opens sharing link in smaller window
 * @restrict A
 */
angular.module('hearth.directives').directive('sharingWindow',
	[
	function() {
		return {
			restrict: 'A',
			scope: false,
			link: function(scope, element, attrs) {
                element.bind('click', function(e){
                	window.open(attrs.href, "Share content", "status = 1, width=550, height=400, resizable = 0, left="+(screen.width-550)/2+",top="+(screen.height-400)/2 );
                    e.preventDefault();
                    e.stopPropagation();
                })
			}
		};
	}]
);
