'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('ProfileDataFeedCtrl', [
    '$scope', '$timeout', '$rootScope', '$routeParams', 'Followers', 'Friends', 'Followees', 'User', 'CommunityMemberships', 'UserRatings', 'UsersActivityLog', 'Fulltext', 'Post',
    function($scope, $timeout, $rootScope, $routeParams, Followers, Friends, Followees, User, CommunityMemberships, UserRatings, UsersActivityLog, Fulltext, Post) {
        var loadServices = {
                'profile': loadUserHome,
                'profile.posts': loadUserPosts,
                'profile.communities': loadCommunities,
                'profile.given': UserRatings.given,
                'profile.received': loadReceivedRatings,
                'profile.following': loadFollowees,
                'profile.followers': loadFollowers,
                'profile.friends': loadFriends,
                'profile.activities': UsersActivityLog.get
            },
            params = {
                user_id: $routeParams.id
            };
        var inited = false;
        $scope.subPageLoaded = false;
        

        function loadFriends(params, done, doneErr) {
            params.related = "user";
            Friends.query(params, done, doneErr);
        }

        function loadReceivedRatings(params, done, doneErr) {
            $scope.loadedRatingPosts = false;
            $scope.ratingPosts = [];

            UserRatings.received(params, done, doneErr);
            
            $scope.$watch('rating.current_community_id', function(val) {
                if(!$scope.mine) {
                    $scope.rating.post_id = 0;
                    UserRatings.possiblePosts({userId: params.user_id, current_community_id: val}, function(res) {
                        var posts = [];
                        
                        res.needed.forEach(function(item) {
                            item.post_type = "needed";
                            posts.push(item);
                        });
                        res.offered.forEach(function(item) {
                            item.post_type = "offered";
                            posts.push(item);
                        });

                        $scope.ratingPosts = posts;
                        $scope.loadedRatingPosts = true;
                    }, function(res) {
                        $scope.loadedRatingPosts = true;
                    });
                }
            });

            var removeListener = $scope.$on('$routeChangeStart', function() {
                $scope.closeUserRatingForm();
                removeListener();
            });
        }

        function loadFollowees(params, done, doneErr) {
            params.related = "user";
            Followees.query(params, done, doneErr);
        }

        function loadFollowers(params, done, doneErr) {
            params.related = "user";
            Followers.query(params, done, doneErr);
        }

        function loadCommunities(params, done, doneErr) {
            CommunityMemberships.query(params, done, doneErr);
        }

        function loadUserPosts(params, done, doneErr) {

            User.getPosts(params, function(res) {

                $scope.postsActive = [];
                $scope.postsInactive = [];

                res.data.forEach(function(item) {
                    if($rootScope.isPostActive(item))
                        $scope.postsActive.push(item);
                    else
                        $scope.postsInactive.push(item);
                });

                finishLoading();
            }, doneErr);
        }

        $scope.refreshItemInfo = function($event, itemNew) {
            // load new posts
            $scope.posts.data.forEach(function(item, key) {
                if(item._id === itemNew._id) {
                    $scope.posts.data[key] = itemNew;
                }
            });
        };

        function loadUserHome(params) {
            params.limit  = 5;
            params.offset = 1;

            async.parallel([
                function(done) {
                    UserRatings.received(params, function(res) {
                        $scope.receivedRatings = res;
                        done(null);
                    }, done);
                },
                function(done) {
                    UsersActivityLog.get(params, function(res) {
                        $scope.activityLog = res;
                        done(null);
                    }, done);
                },
                function(done) {
                    User.getPosts(params, function(res) {
                        $scope.posts = res;
                        done(null);
                    }, done);
                }
            ], finishLoading);

            $scope.$on('updatedItem', $scope.refreshItemInfo);
        }

        $scope.cancelEdit = function() {
            init();
        };

        $scope.close = function() {
            $scope.close();
        };

        function finishLoading() {
            $scope.subPageLoaded = true;
            if(!$scope.$parent)
                $scope.$parent = {};
            $scope.$parent.loaded = true;
            $rootScope.$emit("subPageLoaded");
        }

        function processData(res) {
            $scope.data = res;
            finishLoading();
        }

        function processDataErr(res) {
            finishLoading();
        }

        function init(e) {
            $scope.subPageLoaded = false;
            // console.log("Calling load service", $scope.pageSegment, e);
            // console.log("Calling load service", loadServices[$scope.pageSegment]);
            loadServices[$scope.pageSegment](params, processData, processDataErr);

            // refresh after new post created
            if (! inited && ($scope.pageSegment == 'profile' || $scope.pageSegment == 'profile.posts')) {
                // console.log("Adding listeners");
                $scope.$on('postCreated', function() {
                    $scope.refreshUser(true);
                    loadServices[$scope.pageSegment](params, processData, processDataErr);
                });
                $scope.$on('postUpdated', function() {
                    $scope.refreshUser(true);
                    loadServices[$scope.pageSegment](params, processData, processDataErr);
                });

                // added event listeners - dont add them again
                inited = true;
            }
        }

        // only hide post .. may be used later for delete revert
        $scope.removeItemFromList = function($event, item) {
            $( "#post_"+item._id ).slideUp( "slow", function() {});
            $scope.$emit("profileRefreshUserNoSubpage");
        };

        // this will flash rating box with some background color
        $scope.flashRatingBackground = function(rating) {
            var delayIn = 200;
            var delayOut = 2000;
            var color = "#FFB697";
            var colorOut = $('.rating_'+rating._id + ' .item').css("background-color");

            $('.rating_'+rating._id + ' .item').animate({backgroundColor: color}, delayIn, function() {
                $('.rating_'+rating._id + ' .item').animate({backgroundColor: colorOut}, delayOut );
            });
            $('.rating_'+rating._id + ' .arrowbox').animate({backgroundColor: color}, delayIn, function() {
                $('.rating_'+rating._id + ' .arrowbox').animate({backgroundColor: colorOut}, delayOut );
            });
            $('.rating_'+rating._id + ' .overlap').animate({backgroundColor: color}, delayIn, function() {
                $('.rating_'+rating._id + ' .overlap').animate({backgroundColor: colorOut}, delayOut );
            });

        };

        // will add new rating to data array
        $scope.addUserRating = function($event, item) {
            $scope.data.unshift(item);
            setTimeout(function() {
                $scope.flashRatingBackground(item);
            });
        };

        $scope.$on('userRatingsAdded', $scope.addUserRating);
        $scope.$on('itemDeleted', $scope.removeItemFromList);
        $scope.$on('profileTopPanelLoaded', init);
        // if($rootScope.profileLoaded)
        //     init();
        // $scope.loaded && init();
    }
]);