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

                const filteredKeywords = ['pro', 'kdy', 'jak', 'ananda', 'sileny']

                scope.keywords = [];

                scope.toggleTag = (term) => {
                    Filter.toggleTag(term);
                    scope.keywords.forEach((item) => {
                        if (term === item.term) item.checked = !item.checked;
                    })
                }

                scope.loadKeywords = () => {
                    KeywordsService.listKeywords().then(function (res) {
                        if (res && res.length) {
                            // filter out short- or stop-words
                            scope.keywords = res.filter((item) => {
                                return (item.term.length > 2 && filteredKeywords.indexOf(item.term) === -1)
                            })
                        }
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