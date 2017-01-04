'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.item
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('itemList', [
	'$rootScope', '$q', '$timeout', 'ItemAux', '$compile', 'PostScope', '$templateRequest', '$document',
	function($rootScope, $q, $timeout, ItemAux, $compile, PostScope, $templateRequest, $document) {
		return {
			restrict: 'E',
			scope: {
				options: '='
			},
			template: '<div loading show="loading"></div><div content></div>',
			link: function(scope, el, attrs) {

				scope.loading = true;
				scope.items = [];
				var content = el[0].querySelector('[content]');

				init();

				// function compileTemplate() {
				// 	scope.options.templatePath
				// }

				function init() {
					console.log(scope.options);
					if (typeof scope.options.getData !== 'function') return throw new Error('Unsupported itemList setup');
					var items;
					scope.options.getData(scope.options.getParams || {})
						.then(function(res) {
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
						}).catch(function(err) {
							scope.loading = false;
							console.log('error happend getting items', err);
						});
				}

			}
		}
	}
]);