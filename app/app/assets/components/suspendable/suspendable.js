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
			var watchers, timeout, suspended = false,
				isFarAway = false;

			// detects, if element is visible on screen (+- offset)
			var isElementInView = function(element) {
				var pageTop = $(window).scrollTop();
				var pageBottom = pageTop + $(window).height();
				var elementTop = $(element).offset().top;
				var elementBottom = elementTop + $(element).height();
				var offset = 500;
				var ret;

				// this is an actual result
				ret = ((pageTop - offset < elementTop) && (pageBottom + offset > elementBottom));

				// this means if element is very far away and timeout can be even higher
				offset = 3000;
				isFarAway = !((pageTop - offset < elementTop) && (pageBottom + offset > elementBottom));

				return ret;
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
				if (isFarAway) {
					// longer timeout for far away elements
					timeout = setTimeout(checkVisibility, 5000);
				} else {
					timeout = setTimeout(checkVisibility, 1000);
				}
			}

			setTimeout(checkVisibility, 4000); // call main fction
		}
	}
});