'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.item
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('item', [
    '$timeout', '$translate', 'Auth', '$rootScope',

    function($timeout, $translate, Auth, $rootScope) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                item: '=',
                user: '='
            },
            templateUrl: 'templates/directives/item.html', //must not use name ad.html - adBlocker!
            link: function(scope, element) {
                scope.avatarStyle = {};
                scope.reportNotLoggedIn = 0;
                function drawTimeline() {

                    var elementsHeight = 2 * 18 + $('.avatar', element).outerHeight(true) + $('.name', element).outerHeight(true) + $('.karma', element).outerHeight(true);
                    $('.timeline', element).height($(element).height() - elementsHeight);
                }

                scope.$watch(function() {
                    return [element[0].clientWidth, element[0].clientHeight].join('x');
                }, drawTimeline);

                //     drawTimeline();
                // $timeout(function() {

                //     $(element).css("background-color", "red");
                // });

                var timeout = 6000,
                    init = function() {
                        angular.extend(scope, {
                            replyEdit: false,
                            reply: {
                                message: '',
                                agree: true
                            },
                            submited: false,
                            reported: false,
                            showMore: false,
                            expanded: false
                        });
                        if (scope.replyForm) {
                            scope.replyForm.$setPristine();
                        }
                    },
                    type = {
                        user: {
                            need: 'I_WISH',
                            offer: 'I_GIVE'
                        },
                        community: {
                            need: 'WE_NEED',
                            offer: 'WE_GIVE'
                        }
                    };

                scope.profileLinkType = {
                    "User": "profile",
                    "Community": "community",
                };

                scope.$watch('item', function(item) {
                    var url = window.location.href.replace(window.location.hash, ''),
                        typeText = $translate(item.community_id ? type.community[item.type] : type.user[item.type]);

                    if (item) {
                        url += '%23/ad/' + item._id;
                    }

                    angular.extend(scope, {
                        facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
                        gplus: 'https://plus.google.com/share?url=' + url,
                        twitter: 'https://twitter.com/share?url=' + url,
                        mail: 'mailto:?subject=' + typeText + ': ' + item.title + '&body=' + item.name
                    });
                    scope.mine = scope.item.author._id === ((scope.user) ? scope.user._id : null);
                    if (item.author.locations && item.author.locations[0] && !item.author.locations[0].name) {
                        item.author.locations = [];
                    }
                    if ($('.expandable', element).height() - $('.expandable p ', element).height() < 0) {
                        scope.showMore = true;
                    }
                    if (item.author && item.author.avatar.normal) {
                        scope.avatarStyle = {
                            'background-image': 'url(' + item.author.avatar.normal + ')'
                        };
                    }
                    if (item.author.up_votes) {
                        item.karma = {
                            width: ((item.author.up_votes / (item.author.up_votes + item.author.down_votes)) * 100) + '%'
                        };
                    } else if (item.author.down_votes) {
                        item.karma = {
                            width: 0
                        };
                    } else {
                        item.karma = undefined;
                    }

                });

                scope.toggleCollapsed = function() {
                    $('.expandable', element).toggleClass('expanded');
                    scope.expanded = !scope.expanded;
                };

                scope.toggleReportNotLoggedIn = function() {

                    scope.reportNotLoggedIn = !scope.reportNotLoggedIn;
                };

                scope.report = function() {
                    if(Auth.isLoggedIn()) {

                        scope.$emit('report', {
                            id: scope.item._id
                        });
                        scope.reported = true;
                        scope.cancel();
                        $timeout(function() {
                            scope.reported = false;
                        }, timeout);
                    } else {
                        scope.reportNotLoggedIn = true;
                    }
                };

                scope.sendReply = function() {
                    scope.$emit('sendReply', {
                        id: scope.item._id,
                        message: scope.reply.message,
                        agreed: scope.reply.agree
                    });
                    scope.submited = true;
                    $timeout(init, timeout);
                    scope.item.reply_count = scope.item.reply_count + 1;
                };
                scope.cancelEdit = function() {
                    init();
                };

                scope.alert = function(cc) {
                    alert(cc);
                }
                scope.startEditReply = function() {
                    scope.replyEdit = true;
                };

                scope.edit = function() {
                    // scope.$emit('editAd', scope.item._id);
                    $rootScope.$broadcast('editAd', scope.item._id);
                    // scope.adEdit = true;
                    $rootScope.editItem(scope.item);
                };

                scope.cancel = function() {
                    $('#confirm-delete-'+scope.item._id).foundation('reveal', 'close');
                };

                scope.remove = function() {
                    scope.$emit('removeAd', scope.item._id);
                    scope.cancel();
                };


                scope.$on('closeEditItem', function() {
                    scope.adEdit = false;
                });

                scope.$on('adCreated', function() {
                    scope.adEdit = false;
                });

                init();
            }

        };
    }
]);