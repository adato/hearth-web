'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.apiPrefix
 * @description 
 * @restrict A
 */

angular.module('hearth.directives').directive('apiPrefix', function() {
	return {
		scope: {
			apiHref: '@',
			apiSrc: '@',
			action: '@'
		},
		link: function(scope, element, attrs) {
			return [['apiHref', 'href'], ['ngSrc', 'src'], ['action', 'action']].forEach(function(attr) {
				if (attrs[attr[0]]) {
					return element.attr(attr[1], '' + $$config.apiPath + attrs[attr[0]]);
				}
			});
		}
	};
});