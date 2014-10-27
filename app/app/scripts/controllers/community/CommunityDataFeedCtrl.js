'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityDataFeedCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityDataFeedCtrl', [
	'$scope', '$routeParams', '$rootScope', 'Community', '$route', 'Fulltext', 'CommunityMembers', 'CommunityApplicants', 'CommunityActivityLog', 'Post',
	function($scope, $routeParams, $rootScope, Community, $route, Fulltext, CommunityMembers, CommunityApplicants, CommunityActivityLog, Post) {
		 var loadServices = {
            'community': loadCommunityHome,
            'community.posts': loadCommunityPosts,
            'community.members': loadCommunityMember,
            'community.about': loadCommunityAbout,
            'community.applications': loadCommunityApplications,
            'community.activity-feed': loadCommunityActivityLog,
        };

        function loadCommunityAbout(id, done, doneErr) {
        	// do nothing
        }

        function loadCommunityMember(id, doneErr) {

            CommunityMembers.query({communityId: id}, function(res) {
                $scope.data = res;
            }, doneErr);
        }

        function loadCommunityApplications(id, doneErr) {

            CommunityApplicants.query({communityId: id}, function(res) {
                $scope.data = res;
            }, doneErr);
        }

        function loadCommunityPosts(id, doneErr) {

            var fulltextParams = {
                type: 'post',
                include_not_active: +$scope.mine, // cast bool to int
                include_expired: +$scope.mine, // cast bool to int
                community_id: id,
                limit: 1000
            };

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

         $scope.refreshItemInfo = function($event, itemNew) {
            $scope.posts.data.forEach(function(item, key) {
                if(item._id === itemNew._id) {
                    $scope.posts.data[key] = itemNew;
                }
            });
        };

        function loadCommunityHome(id) {
            var fulltextParams = {
                type: 'post',
                community_id: id
            };

            CommunityActivityLog.get({communityId: id, limit: 5}, function(res) {
                $scope.activityLog = res;
            });
            CommunityApplicants.query({communityId: id}, function(res) {
                $scope.applications = res;
            });
            Fulltext.query(fulltextParams, function(res) {
                $scope.posts = res;
            });

            $scope.$on('updatedItem', $scope.refreshItemInfo);
        }

        function loadCommunityActivityLog(id) {

            CommunityActivityLog.get({communityId: id}, function(res) {
                $scope.data = res;
            }, processDataErr);
        }
        // =================================== Public Methods ====================================

        $scope.cancel = function(item) {
            $('#confirm-delete-' + item._id).foundation('reveal', 'close');
        };

        $scope.remove = function(item) {
            Post.remove({postId: item._id}, function (res) {

                $scope.$emit('postCreated', item._id); // refresh post list
                $scope.cancel(item);
            }, processDataErr);
        };

        $scope.removeMember = function(id) {
        	CommunityMembers.remove({communityId: $scope.info._id, memberId: id}, function(res) {
        		alert("Člen byl vyhozen z komunity");
        		$scope.init();
        	});
        };

        function processData(res) {
            $scope.data = res;
        }

        function processDataErr(res) {
            console.log("Err", res);
        }

        // only hide post .. may be used later for delete revert
        $scope.removeItemFromList = function($event, item) {
            $( ".post_"+item._id ).slideUp( "slow", function() {});
            $scope.init();
        };


        function init() {
            console.log("Calling load service for segment ", $scope.pageSegment);
            loadServices[$scope.pageSegment]($routeParams.id, processData, processDataErr);

            // refresh after new post created
            if ($scope.pageSegment == 'community' || $scope.pageSegment == 'community.posts') {
                $scope.$on('postCreated', function() {
                    // refresh whole page - load new counters, activity feed, posts list
                    $scope.init();
                    // loadServices[$scope.pageSegment]($routeParams.id, processData, processDataErr);
                });
            }
        }

        $scope.$on('itemDeleted', $scope.removeItemFromList);
        $scope.$on('communityTopPanelLoaded', init);
        $scope.loaded && init();
    }
]);