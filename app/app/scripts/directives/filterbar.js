'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.filterbar
 * @description Main bar of app
 * @restrict E
 */
angular.module('hearth.directives').directive('filterbar', [
	'$anchorScroll', '$location',

	function($anchorScroll, $location) {
		return {
			replace: true,
			restrict: 'E',
			templateUrl: 'templates/directives/filterbar.html',
			scope: true,
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

				scope.testFilterActive = function() {
					scope.filterOn = !$.isEmptyObject($location.search());
				};

				scope.$on('filterClose', function() {
					scope.filterSelected = false;
				});

				scope.$on('closeEditItem', function() {
					scope.newItemSelected = false;
				});

				scope.$on('showUI', function($event, ui) {
					scope.filterSelected = ui === 'filter';
					scope.newItemSelected = ui === 'newAd';

					if (ui === 'map') {
						scope.mapSelected = true;
						scope.$broadcast(scope.mapSelected ? 'searchMap' : 'searchList');
						scope.$emit(scope.mapSelected ? 'searchMap' : 'searchList');
					}
					$anchorScroll(ui);
				});

				scope.$on('filterReseted', scope.testFilterActive);
				scope.$on('filterApplied', scope.testFilterActive);

				scope.toggleMap = function() {
					scope.mapSelected = !scope.mapSelected;
					scope.$emit(scope.mapSelected ? 'searchMap' : 'searchList');
				};

				scope.testFilterActive();
			}
		};
	}
]);