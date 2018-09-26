'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.tagCloud
 * @description Renders clickable tag cloud of most used hearth.net keywords
 * @restrict E
 */

angular.module('hearth.directives').directive('tagCloud', [
	'$timeout', 'KeywordsService', 'Filter',
	function($timeout, KeywordsService, Filter) {
		return {
			restrict: 'E',
			scope: {},
			templateUrl: 'assets/components/tagCloud/tagCloud.html',
			link: function(scope) {

                scope.keywords = [];

                scope.toggleTag = function (term) {
                    Filter.toggleTag(term);
                    scope.keywords.forEach(function (item) {
                        if (term === item.term) item.checked = !item.checked;
                    })
                }

                scope.loadKeywords = () => {
                    KeywordsService.listKeywords().then(function (res) {
                        scope.keywords = res;
                    });
                };

                function init() {
                    scope.loadKeywords();
                }

				init();
			}
		}
	}
]);