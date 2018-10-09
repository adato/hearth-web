'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.autocompleteFulltext 
 * @description Creates an input field for fulltext search
 * @restrict A
 */
angular.module('hearth.directives').directive('autocompleteFulltext', ['$timeout', 'FulltextService', 'LocalStorage',
	function($timeout, FulltextService, LocalStorage) {
		return {
            require: 'ngModel',
            restrict: 'AE',
            replace: true,
			scope: {
                'ngModel': '=',
                'onEnter': '&'
            },
            templateUrl: 'assets/components/autocompleteFulltext/autocomplete.html',
			link: function(scope, element, attrs, ngModelCtrl) {
                scope.showAutocomplete = false;
                scope.autocompleted = {};
                scope.autocompleted.users = [];
                scope.autocompleted.communities = [];
                scope.autocompleted.posts = [];
                scope.autocompleted.default = [];
                scope.autocompleted.history = [];
                scope.loading = {
                    posts: false,
                    users: false,
                    communities: false,
                }

                scope.showAutocompleteWithSearchPhrases = function () {
                    scope.autocompleted.users = [];
                    scope.autocompleted.communities = [];
                    scope.autocompleted.posts = [];

                    if (scope.ngModel) {
                        scope.showAutocomplete = true;
                        return scope.searchAutocomplete(scope.ngModel);
                    }

                    let history = JSON.parse(LocalStorage.get("hearth-fulltext-searches")) || [];
                    scope.autocompleted.history = history;


                    FulltextService.querySearchWords().then(function (data) {
                        scope.showAutocomplete = true;
                        scope.autocompleted.default = data;
                    })
                }

                scope.$watch('autocompleted.history', function (newVal, oldVal) {
                    if (!newVal.length) return;
                    scope.autocompleted.historyReversedLimited = newVal.reverse().slice(0, 10);
                });

                scope.$watch('ngModel', function (newVal, oldVal) {
                    if (newVal && !newVal.length) return; // filter null query
                    $timeout(function () {
                        scope.autocompleted.default = [];
                        scope.searchAutocomplete(newVal);

                    }, 500);
                    
                });

                scope.saveSearch = function (query) {
                    if (scope.autocompleted.history.indexOf(query) == -1
                        && query.length) {
                        scope.autocompleted.history.push(query);
                        LocalStorage.set("hearth-fulltext-searches", JSON.stringify(scope.autocompleted.history));
                    }
                }

                scope.removeSearchFromHistory = function (query) {
                    scope.autocompleted.history = scope.autocompleted.history.filter((historyItem) => {
                        if (historyItem == query) {
                            return false;
                        }
                        else return true;
                    });
                    $timeout(() => {
                        LocalStorage.set("hearth-fulltext-searches", JSON.stringify(scope.autocompleted.history));
                    }, 300);
                }

                scope.hideAutocomplete = function () {
                    $timeout(function () {
                        scope.showAutocomplete = false;
                    }, 800)
                }

                scope.searchAutocomplete = function (query) {
                    if (!query || !query.length) return;
                    FulltextService.query({ query: query, type: 'post', limit: 4 }).then(function (data) {
                        if (data.data.length) {
                            scope.autocompleted.posts = data.data; 
                        }
                    })

                    FulltextService.query({ query: query, type: 'user', limit: 4 }).then(function (data) {
                        if (data.data.length) {
                            scope.autocompleted.users = data.data;
                        }
                    })

                    FulltextService.query({ query: query, type: 'community', limit: 4 }).then(function (data) {
                        if (data.data.length) {
                            scope.autocompleted.communities = data.data;
                        }
                    })
                }
			}
		};
	}
]);
