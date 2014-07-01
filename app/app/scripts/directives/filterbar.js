'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.filterbar
 * @description Main bar of app
 * @restrict E
 */
angular.module('hearth.directives').directive('filterbar', [

	function() {
		return {
			replace: true,
			restrict: 'E',
			templateUrl: 'templates/filterbar.html',
			link: function(scope) {
				angular.extend(scope, {
					mapSelected: false,
					filterSelected: false,
					newItemSelected: false
				});

				scope.toggleNewItem = function() {
					if (!scope.filterSelected) {
						scope.newItemSelected = !scope.newItemSelected;
					}
				};

				scope.toggleFilter = function() {
					if (!scope.newItemSelected) {
						scope.filterSelected = !scope.filterSelected;
					}
				};

				scope.$on('closeFilter', function() {
					scope.filterSelected = false;
				});

				scope.$on('closeNewItem', function() {
					scope.newItemSelected = false;
				});

				scope.toggleMap = function() {
					scope.mapSelected = !scope.mapSelected;
					scope.$emit(scope.mapSelected ? 'searchMap' : 'searchList');
				};
				scope.$emit(scope.mapSelected ? 'searchMap' : 'searchList');
			}
		};
	}
]);