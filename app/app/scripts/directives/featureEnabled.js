'use strict';

angular.module('hearth.directives').directive('featureEnabled', function($feature) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			if (!$feature.isEnabled(attrs.featureEnabled)) {
				return element.remove();
			}
		}
	};
});