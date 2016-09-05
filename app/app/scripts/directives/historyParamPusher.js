'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.historyParamPusher
 * @description This will push a param into a current state before going to its hyper reference
 */

angular.module('hearth.directives').directive('historyParamPusher', ['$state', 'ScrollService', '$location', '$timeout', function($state, ScrollService, $location, $timeout) {

	return {
		restrict: 'A',
		link: function(scope, el, attrs) {
			el.bind('click', function(event) {
				event.preventDefault();

				var params = $state.params || {};
				params[ScrollService.MARKETPLACE_SCROLL_TO_PARAM] = scope.$eval(attrs.historyParamPusher);

				// Set the param
				$state.go('.', params, {
					notify: false,
					reload: false
				});
				// After setting the param into history, go to the desired url
				$timeout(function() {
					window.location = attrs.href;
				}, 1);

			})
		}
	};

}]);