'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.scrollToViewOnHash
 * @description if set on element, the element will be scrolled to view using jquery animation when particular hash is in url (url:/page#hash)
 * @restrict A
 */

angular.module('hearth.directives').directive('scrollToViewOnHash', [
	'$location', '$timeout',
	function($location, $timeout) {
		return {
			link: function(scope, el, attrs) {
				var offset = 140; // px offset from top of target
				var animationLength = 500;
				if ($location.hash() !== attrs.scrollToViewOnHash) // go-on only on matching elements
					return;

				$timeout(function() {
					var target = $(el);
					$('html,body').stop().animate({
						scrollTop: target.offset().top - offset
					}, animationLength);
				});
			}
		};
	}
]);
