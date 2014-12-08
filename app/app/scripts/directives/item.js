'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.item
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('item', [
    '$translate', '$rootScope', 'Filter', 'Karma',

    function($translate, $rootScope, Filter, Karma) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                item: '=',
                user: '=',
                community: '=',
                hiddenInit: '=',
                itemDetail: '=',
                hideAvatar: '=',
                keywordsActive: '=',
                inactivateTags: '=',
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

                // public methods from rootScope
                scope.loggedUser = $rootScope.loggedUser;
                scope.isPostActive = $rootScope.isPostActive;
                scope.showLoginBox = $rootScope.showLoginBox;
                scope.reportItem = $rootScope.reportItem;
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
                    scope.postAddress = $rootScope.appUrl+'%23!/ad/'+item._id;
                    scope.isActive = scope.isPostActive(item);

                    // is this my post? if so, show controll buttons and etc
                    if(scope.community)
                        scope.mine = scope.item.author._id === scope.community._id;
                    else
                        scope.mine = scope.item.author._id === ((scope.user) ? scope.user._id : null);

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
            }
        };
    }
]);