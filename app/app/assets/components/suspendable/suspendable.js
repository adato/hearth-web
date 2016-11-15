angular.module('hearth.directives').directive('suspendable', function() {
	return {
		link: function(scope, element, attr) {
			var watchers, timeout, suspended = false;

			var isElementInView = function(element) {
				var pageTop = $(window).scrollTop();
				var pageBottom = pageTop + $(window).height();
				var elementTop = $(element).offset().top;
				var elementBottom = elementTop + $(element).height();
				var offset = 500;

				return ((pageTop - offset < elementTop) && (pageBottom + offset > elementBottom));
			}

			var suspend = function() {
				watchers = scope.$$watchers;
				scope.$$watchers = [];
				suspended = true;
			};

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

			var checkVisibility = function() {
				if (isElementInView(element)) {
					if (suspended) resume();
				} else {
					if (!suspended) suspend();
				}
				timeout = setTimeout(checkVisibility, 1000)
			}

			setTimeout(checkVisibility, 4000);
		}
	}
});