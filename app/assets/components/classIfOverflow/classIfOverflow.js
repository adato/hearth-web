'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.autosizeTextarea
 * @description Makes textarea autoresizing based on content
 * @restrict A
 */
angular.module('hearth.directives').directive('classIfOverflow', ['$timeout',
	function($timeout) {
		return {
			restrict: 'A',
			scope: {
				classIfOverflow: '@',
				inner: '@',
				outer: '@',
				ifNotOverflow: '&?'
			},
			link: function(scope, element, attrs) {
				// test if inner elements overflows container
				scope.isOverflow = function(el) {
					var itIs = el.find(scope.inner).height() > el.height();
					if (!itIs && typeof scope.ifNotOverflow === 'function') {
						scope.ifNotOverflow();
					}
					return itIs;
				};

				scope.toggleClass = function() {
					var el = scope.outer ? element.find(scope.outer) : element;
					if (scope.isOverflow(el))
						el.addClass(scope.classIfOverflow);
					else
						el.removeClass(scope.classIfOverflow);
				};

				$timeout(scope.toggleClass);
				$(window).resize(scope.toggleClass);
				scope.$on('classIfOverflowContentResize', scope.toggleClass);
			}
		};
	}
]);