'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.item
 * @description
 * @restrict E
 *
 * options = {
 * 	disableLoading: false
 * 	getParams: {},
 * 	getData: $resource function,
 * 	templateUrl: String,
 *	cb: function
 * }
 *
 */
angular.module('hearth.directives').directive('itemList', [
	'$rootScope', '$q', '$timeout', 'ItemAux', '$compile', 'PostScope', '$templateRequest', '$document',
	function($rootScope, $q, $timeout, ItemAux, $compile, PostScope, $templateRequest, $document) {
		return {
			restrict: 'E',
			scope: {
				options: '='
			},
			template: '<div loading show="loading && !options.disableLoading"></div><div content></div>',
			link: function(scope, el, attrs) {

				scope.loading = true;
				var content = el[0].querySelector('[content]');

				init();

				function init() {
					if (typeof scope.options.getData !== 'function') throw new TypeError('Unsupported itemList setup');
					var items;

					// call for data
					var promise = scope.options.getData(scope.options.getParams || {})

					// normalize $resource and $q api
					promise = promise.$promise || promise;

					promise.then(function(res) {
						items = res;
						return $templateRequest(scope.options.templateUrl);
					}).then(function(template) {
						scope.loading = false;
						var compiledTemplate = $compile(template);
						var fragment = document.createDocumentFragment();
						items.forEach(function(item) {
							var scope = PostScope.getPostScope(item, $rootScope);
							scope.delayedView = false;
							compiledTemplate(scope, function(clone) {
								fragment.appendChild(clone[0]);
							});
						});
						content.innerHTML = '';
						content.appendChild(fragment);
						if (typeof scope.options.cb === 'function') scope.options.cb();
					}).catch(function(err) {
						scope.loading = false;
						console.log('Error getting items:', err);
					});
				}

			}
		}
	}
]);