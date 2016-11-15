'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.suspendable
 * @description Makes item on a long list suspended when out-of-view. 
 								It moves $$watchers out of scope, and pushes them back on resume. 
 								It can save quite a lot of watchers in $digest cycle
 * @restrict A
 */

angular.module('hearth.directives').directive('suspendable', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
			var watchers, timeout, suspended = false;

			// detects, if element is visible on screen (+- offset)
			var isElementInView = function(element) {
				var pageTop = $(window).scrollTop();
				var pageBottom = pageTop + $(window).height();
				var elementTop = $(element).offset().top;
				var elementBottom = elementTop + $(element).height();
				var offset = 500;

				return ((pageTop - offset < elementTop) && (pageBottom + offset > elementBottom));
			}

			// moves watchers out of scope
			var suspend = function() {
				watchers = scope.$$watchers;
				scope.$$watchers = [];
				suspended = true;
			};

			// resumes watchers
			var resume = function() {
				if (watchers)
					scope.$$watchers = watchers;

				// discard our copy of the watchers
				watchers = void 0;
				suspended = false;
			};

			scope.$on('$destroy', function() {
				clearTimeout(timeout);
			})

			// main function to loop over
			var checkVisibility = function() {
				if (isElementInView(element)) {
					if (suspended) resume();
				} else {
					if (!suspended) suspend();
				}
				timeout = setTimeout(checkVisibility, 1000)
			}

			setTimeout(checkVisibility, 4000); // call main fction
		}
	}
});