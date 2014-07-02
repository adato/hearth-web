'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.fulltextTypeahead
 * @description
 * @restrict AE
 */

angular.module('hearth.directives').directive('fulltextTypeahead', [

	function() {
		return {
			restrict: 'AE',
			replace: true,
			scope: true,
			templateUrl: 'templates/directives/fulltextTypeahead.html',
			link: function(scope) {
				scope.sel = 3;
				scope.setSel = function(sel) {
					scope.sel = sel;
					return scope.sel;
				};
				scope.moveCursor = function($event) {
					var _ref, _ref1, _ref2;
					if (!scope.a.focused && ((_ref = $event.keyCode) === 38 || _ref === 40)) {
						scope.a.focused = true;
					}
					if ($event.keyCode === 38) {
						scope.setSel(scope.sel - 1);
					}
					if ($event.keyCode === 40) {
						scope.setSel(scope.sel + 1);
					}
					if (scope.sel > scope.srch.filters.length) {
						scope.setSel(0);
					}
					if (scope.sel < 0) {
						scope.setSel(scope.srch.filters.length);
					}
					if ($event.keyCode === 27) {
						scope.a.focused = false;
						scope.setSel(0);
					}
					if ($event.keyCode === 13) {
						_ref1 = scope.srch.filters[scope.sel];

						if (_ref1 && _ref1.type) {
							scope.setSearchType(scope.srch.filters[scope.sel].type);
						} else {
							scope.setSearchType(null);
						}
						scope.refreshSearch();
						scope.a.focused = false;
						$event.preventDefault();
					}
					_ref2 = $event.keyCode;
					if (_ref2 === 38 || _ref2 === 40 || _ref2 === 13 || _ref2 === 27) {
						return $event.stopPropagation();
					}
				};
				return scope.moveCursor;
			}
		};
	}
]);