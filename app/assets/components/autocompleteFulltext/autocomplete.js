'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.autocompleteFulltext 
 * @description Creates an input field for fulltext search
 * @restrict A
 */
angular.module('hearth.directives').directive('autocompleteFulltext', ['$timeout', 'FulltextService',
	function($timeout, FulltextService) {
		return {
            restrict: 'AE',
            replace: true,
			scope: {},
            templateUrl: 'assets/components/autocompleteFulltext/autocomplete.html',
			link: function(scope, element, attrs, ngModelCtrl) {
                scope.showAutocomplete = false;
                scope.autocompleted = {};
                scope.autocompleted.users = [];
                scope.autocompleted.communities = [];
                scope.autocompleted.posts = [];
                scope.loading = {
                    posts: false,
                    users: false,
                    communities: false
                }

                scope.offerAutocomplete = function (el) {
                    $timeout(function () {
                        scope.showAutocomplete = true;

                        FulltextService.query({ query: scope.fulltextSearchQuery, type: 'post', limit: 4 }).then(function (data) {
                            scope.autocompleted.posts = data.data;
                        })

                        FulltextService.query({ query: scope.fulltextSearchQuery, type: 'user', limit: 4 }).then(function (data) {
                            scope.autocompleted.users = data.data;
                        })

                        FulltextService.query({ query: scope.fulltextSearchQuery, type: 'community', limit: 4 }).then(function (data) {
                            scope.autocompleted.communities = data.data;
                        })
                    }, 100);
                    
                }

                scope.hideAutocomplete = function () {
                    $timeout(function () {
                        scope.showAutocomplete = false;
                    }, 1000)
                }
			}
		};
	}
]);
