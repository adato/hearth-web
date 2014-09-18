'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ForgottenPasswordCtrl
 * @description
 */

angular.module('hearth.controllers').controller('FulltextCtrl', [
    '$scope', '$routeParams', 'Fulltext', '$location', 'LanguageSwitch', '$translate', '$rootScope',

    function($scope, $routeParams, Fulltext, $location, LanguageSwitch, $translate, $rootScope) {
        var deleteOffset = false;

        $scope.addresses = {
            "Community": "community",
            "User": "profile",
            "Post": "ad",
        };

        $scope.$on('$destroy', function() {
            $scope.topArrowText.top = '';
            $scope.topArrowText.bottom = '';
        });

        angular.extend($scope, {
            queryText: $routeParams.q || '',
            items: [],
            counters: {
                post: 0,
                community: 0,
                user: 0
            },
            filterProperty: 'all'
        });

        $scope.setFilter = function(filter) {
            var params = {
                q: $routeParams.q,
                type: filter
            };

            if (params.type === 'all') {
                delete params.type;
            }

            deleteOffset = true;
            $location.search(params);
            $scope.$emit("fulltextSearch");
        };

        $scope.processData = function(params) {
            return function(response) {
                var i, item, data = response.data;

                $("#fulltextSearchResults").removeClass("searchInProgress");

                for (i = 0; i < data.length; i++) {
                    item = data[i];
                    if (item.author && item.author.avatar.normal) {
                        data[i].avatarStyle = {
                            'background-image': 'url(' + item.author.avatar.normal + ')'
                        };
                    }
                    if (item.avatar && item.avatar.normal) {
                        data[i].avatarStyle = {
                            'background-image': 'url(' + item.avatar.normal + ')'
                        };
                    }
                }

                $scope.items = params.offset > 0 ? $scope.items.concat(data) : data;
                $scope.loaded = true;

                $scope.topArrowText.bottom = $translate('total-count', {
                    value: response.total
                });
                $scope.topArrowText.top = $translate('ads-has-been-read', {
                    value: $scope.items.length
                });
            }
        };
        
        $scope.processStatsData = function(response) {

            $scope.counters = $.extend({
                post: 0,
                community: 0,
                user: 0
            }, response.counters);
        };

        $scope.load = function(addOffset) {
            var params = {
                query: $routeParams.q || "",
                offset: (addOffset) ? $scope.items.length : 0
            };

            if (params.query === '') {
                // dont search empty query and redirect to marketplace
                $location.path("/");
            }

            if (deleteOffset) {

                delete params.offset;
                deleteOffset = false;
            }

            $scope.queryText = params.query;
            $scope.loaded = false;

            if ($location.search().type) {
                params = $.extend(params, $location.search() || {});
            }
            $scope.selectedFilter = $location.search().type || 'all';

            $("#fulltextSearchResults").addClass("searchInProgress");
            
            Fulltext.query(params, $scope.processData(params));
            Fulltext.stats({query: params.query}, $scope.processStatsData);
        };


        $scope.init = function() {
            $scope.languageCode = LanguageSwitch.uses().code;
            $scope.load();
        }

        $scope.$on("fulltextSearch", function(text) {
            $scope.offset = 0;
            $scope.load();
        });

        $scope.$on('initFinished', $scope.init);
        $rootScope.initFinished && $scope.init();
    }
]);
