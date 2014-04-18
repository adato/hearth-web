'use strict';

angular.module('hearth.directives').directive('whenScrolled', [
	'$timeout',
	function($timeout) {
		return function(scope, elm, attr) {
			var lastRun, raw;
			raw = elm[0];
			lastRun = null;
			return angular.element(window).bind('scroll', function(evt) {
				var rectObject;
				rectObject = raw.getBoundingClientRect();
				if (parseInt(rectObject.bottom) > 0 && parseInt(rectObject.bottom) <= parseInt(window.innerHeight)) {
					evt.stopPropagation();
					evt.preventDefault();
					if (lastRun + 2000 < new Date().getTime()) {
						scope.$apply(attr.whenScrolled);
						return lastRun = new Date().getTime();
					}
				}
			});
		};
	}
]);
