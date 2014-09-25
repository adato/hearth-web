'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityDataFeedCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityDataFeedCtrl', [
	'$scope', '$routeParams', '$rootScope', 'Community', '$route', 'Fulltext',
	function($scope, $routeParams, $rootScope, Community, $route, Fulltext) {
		$scope.loaded = true;
		 var loadServices = {
            'community': loadCommunityHome,
            'community.posts': loadCommunityPosts,
            'community.members': loadCommunityMember,
            'community.about': loadCommunityAbout,
        },
        params = {
            community_id: $routeParams.id
        };

        function loadCommunityAbout(params, done, doneErr) {
        	// do nothing
        }

        function loadCommunityMember(params, done, doneErr) {

            CommunityMemberships.query(params, function(res) {
                $scope.communityAdminCount = 0;
                if(res) {
                    res.forEach(function(item) {
                        $scope.communityAdminCount += +item.current_user_admin;
                    });
                }

                done(res);
            }, doneErr);
        }

        function loadCommunityPosts(params, done, doneErr) {

            var fulltextParams = {
                type: 'post',
                include_not_active: +$scope.mine, // cast bool to int
                include_expired: +$scope.mine, // cast bool to int
                author_id: params.community_id,
                limit: 1000
            }

            Fulltext.query(fulltextParams, function(res) {

                $scope.postsActive = [];
                $scope.postsInactive = [];

                res.data.forEach(function(item) {
                    if(item.is_active && !item.is_expired)
                        $scope.postsActive.push(item);
                    else
                        $scope.postsInactive.push(item);
                });
            }, doneErr);
        }

        function loadCommunityHome(params) {
            var fulltextParams = {
                type: 'post',
                author_id: params.community_id
            }

            console.log("home");
            // UserRatings.received(params, function(res) {
            //     $scope.receivedRatings = res;
            // });
            // ActivityLog.get(params, function(res) {
            //     $scope.activityLog = res;
            // });
            // Fulltext.query(fulltextParams, function(res) {
            //     $scope.posts = res;
            // });
        }

        $scope.pauseToggle = function(item) {
            var Action = (item.is_active) ? Post.suspend : Post.resume;

            Action({
                    id: item._id
                },
                function(res) {
                    item.is_active = !item.is_active;
                    $scope.cancel(item);
                }
            );
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
            if ($scope.pageSegment == 'community' || $scope.pageSegment == 'community.posts') {
                $scope.$on('postCreated', function() {
                    loadServices[$scope.pageSegment](params, processData, processDataErr);
                });
            }
        }

        $scope.$on('communityTopPanelLoaded', init);
        $scope.loaded && init();
    }
]);