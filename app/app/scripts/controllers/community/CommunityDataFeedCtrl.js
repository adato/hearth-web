'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityDataFeedCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityDataFeedCtrl', [
	'$scope', '$routeParams', '$rootScope', 'Community', '$route', 'Fulltext', 'CommunityMembers', 'CommunityApplicants', 'CommunityActivityLog',
	function($scope, $routeParams, $rootScope, Community, $route, Fulltext, CommunityMembers, CommunityApplicants, CommunityActivityLog) {
		 var loadServices = {
            'community': loadCommunityHome,
            'community.posts': loadCommunityPosts,
            'community.members': loadCommunityMember,
            'community.about': loadCommunityAbout,
            'community.applications': loadCommunityApplications,
            'community.activity-feed': CommunityActivityLog.get,
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
                author_id: id,
                limit: 1000
            };

            Fulltext.query(fulltextParams, function(res) {
            	console.log(res);

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

        function loadCommunityHome(id) {
            var fulltextParams = {
                type: 'post',
                author_id: id
            };

            CommunityActivityLog.get({communityId: id}, function(res) {
                $scope.activityLog = res;
            });
            CommunityApplicants.query({communityId: id}, function(res) {
                $scope.applications = res;
            });
            Fulltext.query(fulltextParams, function(res) {
                $scope.posts = res;
            });
        }

        // =================================== Public Methods ====================================
        
        $scope.rejectApplication = function(id)  {

        	CommunityApplicants.remove({communityId: $scope.info._id, applicantId: id}, function(res) {
        		$scope.init();
        	}, function(res) {
        		alert("There was an error while processing this post.");
        	});
        };

        $scope.approveApplication = function(id) {

        	CommunityMembers.add({communityId: $scope.info._id, user_id: id}, function(res) {
        		$scope.init();
        	}, function(res) {
        		alert("There was an error while processing this post.");
        	});
        };

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

        $scope.removeMember = function(id) {
        	CommunityMembers.remove({communityId: $scope.info._id, memberId: id}, function(res) {
        		alert("Člen byl vyhozen z komunity");
        		init();
        	});
        };

        function processData(res) {
            $scope.data = res;
        }

        function processDataErr(res) {
            console.log("Err", res);
        }

        function init() {
            console.log("Calling load service for segment ", $scope.pageSegment);
            loadServices[$scope.pageSegment]($routeParams.id, processData, processDataErr);

            // refresh after new post created
            if ($scope.pageSegment == 'community' || $scope.pageSegment == 'community.posts') {
                $scope.$on('postCreated', function() {
                    loadServices[$scope.pageSegment]($routeParams.id, processData, processDataErr);
                });
            }
        }

        $scope.$on('communityTopPanelLoaded', init);
        $scope.loaded && init();
    }
]);