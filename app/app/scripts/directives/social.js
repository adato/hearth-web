'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.social
 * @description Displays social networks links
 * @restrict E
 */
angular.module('hearth.directives').directive('social', [
    'Facebook', '$timeout',
    function(Facebook, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                item: '=',
                title: '=',
                summary: '=',
                facebookInvite: '@'
            },
            templateUrl: 'templates/social.html',
            link: function(scope) {

                scope.fbInvite = function() {

                    Facebook.inviteFriends();
                    return false;
                }

                scope.$watch('item', function(value) {
                    var url = window.location.href.replace(window.location.hash, ''),
                        title = encodeURIComponent(scope.title),
                        summary = encodeURIComponent(scope.summary);


                    if (value) {
                        url += '%23%21/ad/' + value;
                    }


                    angular.extend(scope, {
                        facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
                        gplus: 'https://plus.google.com/share?url=' + url,
                        twitter: 'https://twitter.com/share?url=' + url,
                        linkedin: 'http://www.linkedin.com/shareArticle?mini=true&url=' + url + '&title=' + title + '&summary=' + summary
                    });
                });

            }

        };
    }
]);