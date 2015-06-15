'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('ProfileDataFeedCtrl', [
    '$scope', '$timeout', '$rootScope', '$stateParams', 'Followers', 'Friends', 'Followees', 'User', 'CommunityMemberships', 'UserRatings', 'UsersActivityLog', 'Fulltext', 'Post',
    function($scope, $timeout, $rootScope, $stateParams, Followers, Friends, Followees, User, CommunityMemberships, UserRatings, UsersActivityLog, Fulltext, Post) {
        var loadServices = {
                'home': loadUserHome,
                'posts': loadUserPosts,
                'replies': loadUserReplies,
                'communities': loadCommunities,
                'given-ratings': UserRatings.given,
                'received-ratings': loadReceivedRatings,
                'following': loadFollowees,
                'followers': loadFollowers,
                'friends': loadFriends,
                'activities': UsersActivityLog.get
            },
            params = {
                user_id: $stateParams.id
            };

        $scope.postTypes = $$config.postTypes;
        $scope.loadingData = false;

        var inited = false;
        $scope.subPageLoaded = false;
        

        $scope.loadBottom = function() {
            $scope.loadingData = true;
            loadServices[$scope.pageSegment]($stateParams.id, processData, processDataErr);
        };

        function loadFriends(params, done, doneErr) {
            params.related = "user";
            Friends.query(params, done, doneErr);
        }

        function loadReceivedRatings(params, done, doneErr) {
            $scope.loadedRatingPosts = false;
            $scope.ratingPosts = [];

            params.offset = $scope.data.
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
        };

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

        function loadUserReplies(params, done, doneErr) {

            User.getReplies({}, function(res) {
                $scope.replies = res.replies;
                finishLoading();
            }, doneErr);
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
            params.offset = 0;

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
            if(res && res.length)
                $scope.loadingData = false;

            $scope.subPageLoaded = true;
            if(!$scope.$parent)
                $scope.$parent = {};
            $scope.$parent.loaded = true;
            $rootScope.$emit("subPageLoaded");
        }

        function processData(res) {
            $scope.data = $scope.data.concat(res);
            finishLoading();
        }

        function processDataErr(res) {
            finishLoading();
        }

        function init(e) {
            $scope.pageSegment = $stateParams.page || 'home';
            if(!loadServices[$scope.pageSegment]) return;

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
            $("#post_"+item._id).slideUp( "slow", function() {});
            $scope.$emit("profileRefreshUserNoSubpage");
        };
        
        // will add new rating to data array
        $scope.addUserRating = function($event, item) {
            $scope.data.unshift(item);
            $scope.flashRatingBackground(item);
        };

        $scope.$on('userRatingsAdded', $scope.addUserRating);
        $scope.$on('itemDeleted', $scope.removeItemFromList);
        $scope.$on('profileTopPanelLoaded', init);
        init();
    }
]);