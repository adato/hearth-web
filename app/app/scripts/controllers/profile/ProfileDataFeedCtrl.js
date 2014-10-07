'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('ProfileDataFeedCtrl', [
    '$scope', '$timeout', '$rootScope', '$routeParams', 'Followers', 'Friends', 'Followees', 'UserPosts', 'CommunityMemberships', 'UserRatings', 'UsersActivityLog', 'Fulltext', 'Post',
    function($scope, $timeout, $rootScope, $routeParams, Followers, Friends, Followees, UserPosts, CommunityMemberships, UserRatings, UsersActivityLog, Fulltext, Post) {
        var loadServices = {
                'profile': loadUserHome,
                'profile.posts': loadUserPosts,
                'profile.communities': loadCommunities,
                'profile.given': UserRatings.given,
                'profile.received': UserRatings.received,
                'profile.following': loadFollowees,
                'profile.followers': loadFollowers,
                'profile.friends': loadFriends,
                'profile.activities': UsersActivityLog.get
            },
            params = {
                user_id: $routeParams.id
            };

        function loadFollowees(params, done, doneErr) {
            params.related = "user";
            Followees.query(params, done, doneErr);
        }

        function loadFollowers(params, done, doneErr) {
            params.related = "user";
            Followers.query(params, done, doneErr);
        }

        function loadFriends(params, done, doneErr) {
            params.related = "user";
            Friends.query(params, done, doneErr);
        }

        function loadCommunities(params, done, doneErr) {

            CommunityMemberships.query(params, function(res) {
                console.log(res);
                $scope.communityAdminCount = 0;
                if(res) {
                    res.forEach(function(item) {
                        $scope.communityAdminCount += +item.current_user_admin;
                    });
                }
                done(res);
            }, doneErr);
        }

        function loadUserPosts(params, done, doneErr) {

            var fulltextParams = {
                type: 'post',
                related: 'user',
                include_not_active: +$scope.mine, // cast bool to int
                include_expired: +$scope.mine, // cast bool to int
                author_id: params.user_id,
                limit: 1000
            }

            Fulltext.query(fulltextParams, function(res) {

                $scope.postsActive = [];
                $scope.postsInactive = [];

                res.data.forEach(function(item) {
                    if($rootScope.isPostActive(item))
                        $scope.postsActive.push(item);
                    else
                        $scope.postsInactive.push(item);
                });
            }, doneErr);
        }

        function loadUserHome(params) {
            var fulltextParams = {
                type: 'post',
                related: 'user',
                author_id: params.user_id,
            }

            params.limit = 5;
            UserRatings.received(params, function(res) {
                $scope.receivedRatings = res;
            });
            UsersActivityLog.get(params, function(res) {
                $scope.activityLog = res;
            });
            Fulltext.query(fulltextParams, function(res) {
                $scope.posts = res;
            });
        }

        $scope.cancelEdit = function() {
            init();
        };

        $scope.cancel = function(item) {
            $('#confirm-delete-' + item._id).foundation('reveal', 'close');
        };

        $scope.remove = function(item) {
            Post.remove({postId: item._id}, function (res) {

                $scope.$emit('postCreated', item._id); // refresh post list
                $scope.cancel(item);
            }, processDataErr);
        };

        function processData(res) {
            $rootScope.subPageLoaded = true;
            $scope.data = res;
        }

        function processDataErr(res) {
            console.log("Err", res);
        }

        function init() {

            console.log("Calling load service", $scope.pageSegment);
            console.log("Calling load service", loadServices[$scope.pageSegment]);
            loadServices[$scope.pageSegment](params, processData, processDataErr);

            // refresh after new post created
            if ($scope.pageSegment == 'profile' || $scope.pageSegment == 'profile.posts') {

                $scope.$on('postCreated', function() {
                    loadServices[$scope.pageSegment](params, processData, processDataErr);
                });
            }
        }

        $scope.$on('profileTopPanelLoaded', init);
        $scope.loaded && init();
    }
]);