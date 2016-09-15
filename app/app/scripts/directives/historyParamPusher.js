'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.historyParamPusher
 * @description This will push a param into a current state before going to its hyper reference
 */

angular.module('hearth.directives').directive('historyParamPusher', ['$state', 'ScrollService', '$location', '$timeout', '$rootScope', function($state, ScrollService, $location, $timeout, $rootScope) {

	return {
		restrict: 'A',
		link: function(scope, el, attrs) {
			el.bind('click', function(event) {
				event.preventDefault();

				// Set the param
				$location.search(ScrollService.MARKETPLACE_SCROLL_TO_PARAM, scope.$eval(attrs.historyParamPusher));

				// make sure it appears it properly
				if (!$rootScope.$$phase) $rootScope.$apply();

				// After setting the param into history, go to the desired url
				$timeout(function() {
					window.location = attrs.href;
				}, 1);

			})
		}
	};

}]);