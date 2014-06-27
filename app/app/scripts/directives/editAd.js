'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.editAd
 * @description M
 * @restrict E
 */
angular.module('hearth.directives').directive('editad', [
	'$filter', 'LanguageSwitch',

	function($filter, LanguageSwitch) {
		return {
			replace: true,
			restrict: 'E',
			scope: {},
			templateUrl: 'templates/editItem.html', //must not use name ad.html - adBlocker!
			link: function(scope) {
				scope.post = {
					type: 'offer',
					isPrivate: false,
					date: $filter('date')(new Date().getTime() + 30 * 24 * 60 * 60 * 1000, LanguageSwitch.uses() === 'cs' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'),
					sharing_allowed: true,
					locations: [{
						name: ''
					}]
				};

				scope.close = function() {
					scope.$emit('closeNewItem');
				};
			}
		};
	}
]);