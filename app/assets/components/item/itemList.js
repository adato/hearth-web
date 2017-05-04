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
					scope.options = scope.options || {};
					if (typeof scope.options.getData !== 'function') throw new TypeError('Unsupported itemList setup');
					var responseTransform = scope.options.responseTransform || angular.identity;

					var items;
					content.innerHTML = '';

					// call for data
					var promise = scope.options.getData(scope.options.getParams || {});

					// normalize $resource and $q api
					promise = promise.$promise || promise;

					promise.then(res => {
						items = responseTransform(res);
						return $templateRequest(scope.options.templateUrl);
					}).then(template => {
						scope.loading = false;
						var compiledTemplate = $compile(template);
						var fragment = document.createDocumentFragment();
						items.forEach(function(item) {
							let _scope = PostScope.getPostScope(item, $rootScope);
							_scope.delayedView = false;
							_scope.inactivateTags = !!scope.options.inactivateTags;
							compiledTemplate(_scope, clone => {
								fragment.appendChild(clone[0]);
							});
						});
						content.innerHTML = '';
						content.appendChild(fragment);
						if (typeof scope.options.cb === 'function') scope.options.cb(items);
					}).catch(err => {
						scope.loading = false;
						console.log('Error getting items:', err);
					});
				}

				var listener = $rootScope.$on('itemList.refresh', init);

				scope.$on('$destroy', function() {
					listener();
				});

			}
		}
	}
]);