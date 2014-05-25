'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.featureDisabled
 * @description 
 * @restrict A
 */

angular.module('hearth.directives').directive('featureDisabled', function($feature) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			if ($feature.isEnabled(attrs.featureDisabled)) {
				return element.remove();
			}
		}
	};
});