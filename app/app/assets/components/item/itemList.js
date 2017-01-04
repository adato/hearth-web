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
			template: '<item ng-repeat="item in items"></div>',
			link: function(scope, el, attrs) {

				init();

				function compileTemplate() {
					scope.options.templatePath
				}

				function init() {
					if (typeof scope.options.getData === 'function') {
						var items;
						scope.options.getData(scope.options.getParams || {})
							.then(function(res) {
								console.log('oks', res);

								items = res;
								return $templateRequest(templateUrl);
							}).then(function(template) {
								var compiledTemplate = $compile(template);

								var fragment = $document.createDocumentFragment();
								items.forEach(function(item) {
									var scope = PostScope.getPostScope(post, $scope);
									compiledTemplate(scope, function(clone) {
										fragment.append(clone[0]);
									});
								});
								el.append(fragment);
							}).catch(function(err) {
								console.log('error happend getting items', err);
							});
					}
				}

			}
		}
	}
]);