'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.promoPost
 * @description Creates banner which can disappear at given day
 * @restrict A
 */
angular.module('hearth.directives').directive('promoPost', ['$rootScope', 'LocalStorage', 'Time',
	function($rootScope, LocalStorage, Time) {
		return {
			scope: {
				'id': '@',
				'showFromDate': '@', // if set, time counts to midnight
				'showUntilDate': '@', // if set, time counts from midnight
				// so when you want to show banner only on 2020-02-02, then showFromDate=2020-02-02, showUntilDate=2020-02-03
			},
			// bindToController: true,
			restrict: 'E',
			controller: ['$scope', function ($scope) {
				var vm = this;
				vm.showPromo = null;
				vm.id = $scope.id;
				vm.config = $$config;

				vm.getPromoState = function (id) {
					var state = LocalStorage.get(id);
					if (state == null || state == true) return true;
					return false;
				}
		
				vm.hidePromo = function() {
					LocalStorage.set($scope.id, 0);
					vm.showPromo = false;
				}

				function init() {
					if ($scope.showUntilDate) {
						var daysFromNow = Time.getDateDiffToNow($scope.showUntilDate, 'hours'); // if in future, result is negative
						if (daysFromNow > 0) vm.showPromo = false;
					}
					if ($scope.showFromDate) {
						var daysFromNow = Time.getDateDiffToNow($scope.showFromDate, 'hours'); // if in future, result is negative
						if (daysFromNow < 0) vm.showPromo = false;
					}

					vm.showPromo = (vm.showPromo === null ? vm.getPromoState($scope.id) : vm.showPromo);
				}

				init();
			}],
			controllerAs: 'vm',
			templateUrl: function (elem, attrs) {
				return 'assets/components/promoPost/template-' + attrs["id"] + '.html';
				// when including template, please dont forget:
				// * ng-if="vm.showPromo" on root element
				// * ng-click="vm.hidePromo()" on closing button/link/etc
			},
			link: function(scope, element, attrs) {
			}
		};
	}
]);