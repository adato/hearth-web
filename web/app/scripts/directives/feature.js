'use strict';

angular.module('hearth.directives').directive('feature', function($feature) {
	return {
		restrict: 'EC',
		scope: {
			enabled: '@',
			disabled: '@'
		},
		link: function(scope, element, attrs) {
			if (((attrs.enabled != null) && !$feature.isEnabled(attrs.enabled)) || ((attrs.disabled != null) && $feature.isEnabled(attrs.disabled))) {
				return element.remove();
			}
		}
	};
});