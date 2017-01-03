'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.item
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('itemList', [
	'$translate', '$rootScope', 'Filter', 'Karma', '$timeout', '$filter', 'Rights', 'ItemAux',
	function($translate, $rootScope, Filter, Karma, $timeout, $filter, Rights, ItemAux) {
		return {
			restrict: 'E',
			scope: {
				options: '='
			},
			template: '<item ng-repeat="item in items"></div>'
			link: function(scope, el, attrs) {

				scope.items = (function() {
					if (typeof scope.options.getData === 'function') {
						scope.options.getData(scope.options.getParams || {}, function(res) {
							console.log('oks', res);
							return res;
						}, function(err) {
							console.log('error happend getting items', err);
						});
					}
				})();

			}
		}
	}
]);