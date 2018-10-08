'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.tagCloud
 * @description Renders clickable tag cloud of most used hearth.net keywords
 * @restrict E
 */

angular.module('hearth.services').service('tagCloudCache', ['$cacheFactory', function ($cacheFactory) {
    return $cacheFactory("tagCloudCache");
}]);

angular.module('hearth.directives').directive('tagCloud', [
	'$timeout', 'KeywordsService', 'Filter', 'tagCloudCache', 'Interests',
	function($timeout, KeywordsService, Filter, tagCloudCache, Interests) {
		return {
			restrict: 'E',
			scope: {},
			templateUrl: 'assets/components/tagCloud/tagCloud.html',
			link: function(scope) {

                scope.commonKeywords = [];
                scope.userKeywords = [];

                scope.toggleTag = function (term, toggle) {
                    if (toggle) Filter.toggleTag(term);
                    
                    scope.commonKeywords.forEach(function (item) {
                        if (term === item.term) item.checked = !item.checked;
                    })
                    scope.userKeywords.forEach(function (item) {
                        if (term === item.term) item.checked = !item.checked;
                    })
                }

                scope.uncheckAll = function () {
                    scope.commonKeywords.forEach(function (item) {
                        item.checked = false;
                    })
                    scope.userKeywords.forEach(function (item) {
                        item.checked = false;
                    })
                }

                scope.loadKeywords = () => {
                    if (angular.isUndefined(tagCloudCache.get("keywords"))) {
                        KeywordsService.listKeywords().then(function (res) {
                            scope.commonKeywords = res;
                            tagCloudCache.put("keywords", res);
                        });
                    } else {
                        scope.commonKeywords = tagCloudCache.get("keywords");
                    }

                    Interests.queryCurrentUser().then(function (res) {
                        scope.userKeywords = res.map(function (item) { 
                            return { 
                                term: item,
                                checked: false,
                            }
                        });
                    });
                };


                function reloadOnEvent() {
                    scope.uncheckAll();
                    var filterKeywords = Filter.get().keywords;
                    filterKeywords.forEach(function (item) {
                        scope.toggleTag(item, false);
                    })
                }
                
                function init() {
                    scope.loadKeywords();

                    scope.$on("filterApplied", reloadOnEvent);
                    $timeout(reloadOnEvent, 1000);

                }

				init();
			}
		}
	}
]);