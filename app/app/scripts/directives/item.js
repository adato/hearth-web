'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.item
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('item', [
    '$timeout', '$translate', 'Auth', '$rootScope', '$location', 'Filter', 'Post', 'Karma',

    function($timeout, $translate, Auth, $rootScope, $location, Filter, Post, Karma) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                item: '=',
                user: '=',
                community: '=',
                hideAvatar: '=',
                keywordsActive: '=',
                inactivateTags: '=',
            },
            templateUrl: 'templates/directives/item.html', //must not use name ad.html - adBlocker!
            link: function(scope, element) {
                var pauseProgress = false;
                var timeout = 6000;
                var type = {
                    user: {
                        need: 'I_WISH',
                        offer: 'I_GIVE'
                    },
                    community: {
                        need: 'WE_NEED',
                        offer: 'WE_GIVE'
                    }
                };
                
                // default values
                scope.avatarStyle = {};
                scope.reportNotLoggedIn = 0;
                scope.toggleTag = (scope.inactivateTags) ? function() {} : Filter.toggleTag;
                scope.keywords = scope.keywordsActive || [];
                
                // public methods from rootScope
                scope.isPostActive = $rootScope.isPostActive;
                scope.showLoginBox = $rootScope.showLoginBox;
                scope.reportItem = $rootScope.reportItem;
                scope.pauseToggle = $rootScope.pauseToggle;
                scope.closeModal = $rootScope.closeModal;
                scope.deleteItem = $rootScope.deleteItem;


                function drawTimeline() {

                    // var elementsHeight = 2 * 18 + $('.avatar', element).outerHeight(true) + $('.name', element).outerHeight(true) + $('.karma', element).outerHeight(true);
                    // $('.timeline', element).height($(element).height() - elementsHeight);
                }

                scope.$watch(function() {
                    return [element[0].clientWidth, element[0].clientHeight].join('x');
                }, drawTimeline);

                
                scope.init = function() {
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
                }

                scope.profileLinkType = {
                    "User": "profile",
                    "Community": "community",
                };

                scope.$watch('item', function(item) {
                    if(! item._type) {
                        return false;
                    }

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

                    if(scope.community)
                        scope.mine = scope.item.author._id === ((scope.community._id) ? scope.community._id : null);
                    else
                        scope.mine = scope.item.author._id === ((scope.user) ? scope.user._id : null);

                    if (item.author.locations && item.author.locations[0] && !item.author.locations[0].name) {
                        item.author.locations = [];
                    }
                    if ($('.expandable', element).height() - $('.expandable p ', element).height() < 0 || item.attachments_attributes.length > 3) {
                        scope.showMore = true;
                    }

                    item.karma = Karma.count(item.author.up_votes, item.author.down_votes);
                    if(item.karma) {
                        item.karma += "%";
                    }

                });

                scope.toggleCollapsed = function() {
                    $('.show-more', element).toggleClass('expanded');
                    $('.text-container .expandable', element).css("max-height", (scope.expanded) ? 80 : 3000);
                    $('.attachments .expandable', element).css("max-height", (scope.expanded) ? 190 : 3000);
                    $('.attachments .lazyLoad', element).each(function() {
                        $(this).attr("src", $(this).attr("data-src"));
                        $(this).fadeIn();
                    });
                    scope.expanded = !scope.expanded;
                };

                scope.toggleReportNotLoggedIn = function() {
                    $rootScope.showLoginBox();
                    //scope.reportNotLoggedIn = !scope.reportNotLoggedIn;
                };

                scope.sendReply = function() {
                    scope.$emit('sendReply', {
                        id: scope.item._id,
                        message: scope.reply.message,
                        agreed: scope.reply.agree
                    });
                    scope.submited = true;
                    $timeout(scope.init, timeout);
                    scope.item.reply_count = scope.item.reply_count + 1;
                };
                scope.cancelEdit = function() {
                    scope.init();
                };

                scope.edit = function() {
                    // scope.$emit('editAd', scope.item._id);
                    $rootScope.$broadcast('editAd', scope.item._id);
                    // scope.adEdit = true;
                    $rootScope.editItem(scope.item);
                };

                scope.replyItem = function() {
                    $rootScope.replyItem(scope.item);
                };

                scope.cancel = function() {
                    $('#confirm-delete-'+scope.item._id).foundation('reveal', 'close');
                };

                scope.$on('closeEditItem', function() {
                    scope.adEdit = false;
                });

                scope.$on('adCreated', function() {
                    scope.adEdit = false;
                });

                scope.init();
            }

        };
    }
]);