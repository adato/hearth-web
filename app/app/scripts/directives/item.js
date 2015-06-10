'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.item
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('item', [
    '$translate', '$rootScope', 'Filter', 'Karma', '$timeout',

    function($translate, $rootScope, Filter, Karma, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                item: '=',
                user: '=',
                community: '=',
                delayedView: '=',
                itemDetail: '=',
                hideAvatar: '=',
                keywordsActive: '=',
                inactivateTags: '=',
                foundationColumnsClassname: '=',
                notExpandable: '='
            },
            templateUrl: 'templates/directives/item.html', //must not use name ad.html - adBlocker!
            link: function(scope, element) {
                scope.postTypes = {
                    User: {
                        need: 'DOES_WISH',
                        offer: 'DOES_GIVE'
                    },
                    Community: {
                        need: 'WE_NEED',
                        offer: 'WE_GIVE'
                    }
                };

                scope.replyLabel = {
                    offer: 'WISH_GIFT',
                    need: 'OFFER_GIFT'
                };

                scope.replyCountTexts = {
                    offer: 'PEOPLE_COUNT_WISH_PL',
                    need: 'PEOPLE_COUNT_OFFER_PL'
                };

                // default values
                scope.toggleTag = (scope.inactivateTags) ? function() {} : Filter.toggleTag;
                scope.keywords = scope.keywordsActive || [];
                scope.showListener = false; // waiting to be called for show post
                scope.foundationColumnsClass = scope.foundationColumnsClassname || 'large-10';
                scope.postExpanded = scope.notExpandable || false;

                // public methods from rootScope
                scope.loggedUser = $rootScope.loggedUser;
                scope.isPostActive = $rootScope.isPostActive;
                scope.showLoginBox = $rootScope.showLoginBox;
                scope.pauseToggle = $rootScope.pauseToggle;
                scope.pluralCat = $rootScope.pluralCat;
                scope.deleteItem = $rootScope.deleteItem;
                scope.confirmBox = $rootScope.confirmBox;
                scope.DATETIME_FORMATS = $rootScope.DATETIME_FORMATS;
                scope.toggleReportNotLoggedIn = $rootScope.showLoginBox;
                scope.replyItem = $rootScope.replyItem;
                scope.edit = $rootScope.editItem;
                scope.socialLinks = $rootScope.socialLinks;
                scope.getProfileLinkByType = $rootScope.getProfileLinkByType;
                scope.openReportBox = $rootScope.openReportBox;
                scope.openEmailSharingBox = $rootScope.openEmailSharingBox;
                scope.removeItemFromCommunity = $rootScope.removeItemFromCommunity;

                /**
                 * Init basic structure
                 */
                scope.init = function() {
                    scope.showMore = false;
                    scope.expanded = false;
                    scope.isActive = false;
                };

                /**
                 * When updated item, refresh its info
                 */
                scope.$watch('item', function(item) {
                    if (! item)
                        return false;
                    
                    // post address for social links
                    scope.postAddress = $rootScope.appUrl+'post/'+item._id;
                    scope.isActive = scope.isPostActive(item);

                    // is this my post? if so, show controll buttons and etc
                    scope.mine = scope.item.owner_id === ((scope.user) ? scope.user._id : null);

                    scope.isExpiringSoon = !scope.item.valid_until_unlimited && moment(scope.item.valid_until).subtract(7, 'days').isBefore(new Date())
                                                && moment(scope.item.valid_until).isAfter(new Date());

                    // if the post is show instantly (without any effect) recount his height now
                    if(!scope.delayedView)
                        scope.recountHeight();
                    
                    // count Karma length
                    item.karma = Karma.count(item.author.up_votes, item.author.down_votes);
                    if(item.karma) {
                        item.karma += "%";
                    }
                });
                
                /**
                 * When post is shown, recount his height and display link to show/hide more
                 */
                scope.recountHeight = function() {
                    return scope.showMore = $('.expandable', element).height() - $('.expandable p ', element).height() < 0 || scope.item.attachments_attributes.length > 3;
                };

                scope.displayDelayed = function(ev, done) {
                    scope.showListener(); // stop listening for this event

                    var item = $(element);
                    // show first 3 items with fadeIn effect, then use slideDown
                    var showMethod = (scope.item.index < 3) ? item.fadeIn : item.slideDown;
                    
                    // $("#post_"+scope.item._id).show();
                    // $timeout(scope.recountHeight);
                    // scope.delayedView = false;
                    

                    setTimeout(function() {
                        showMethod.call(item, 200, function() {
                            $timeout(function() {
                                scope.delayedView = false;
                                scope.recountHeight();

                                if(scope.item.isLast) {
                                    done(scope.item.index);
                                }
                            });
                        });
                    }, 150 * (scope.item.index - 1));
                };

                scope.toggleCollapsed = function() {
                    $('.show-more', element).toggleClass('expanded');
                    $('.text-container .expandable', element).css("max-height", (scope.expanded) ? 80 : 3000);
                    $('.attachments .expandable', element).css("max-height", (scope.expanded) ? 205 : 3000);
                    $('.attachments .lazyLoad', element).each(function() {
                        $(this).attr("src", $(this).attr("data-src"));
                        $(this).fadeIn();
                    });

                    scope.expanded = !scope.expanded;
                };

                scope.refreshItemInfo = function($event, item) {
                    // if renewed item is this item, refresh him!
                    if(item._id === scope.item._id) {
                        scope.item = item;
                    }
                };
                
                scope.init();
                $rootScope.$on('updatedItem', scope.refreshItemInfo);

                // when we hide item after init and then show him with some effect,
                // we need to recount his height after displayed
                if(scope.delayedView)
                    scope.showListener = scope.$on('showHiddenPosts', scope.displayDelayed);
            }
        };
    }
]);