'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityDataFeedCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityDataFeedCtrl', [
	'$scope', '$stateParams', '$rootScope', 'Community', 'Fulltext', 'CommunityMembers', 'CommunityApplicants', 'CommunityActivityLog', 'Post', 'Notify', '$timeout',
	function($scope, $stateParams, $rootScope, Community, Fulltext, CommunityMembers, CommunityApplicants, CommunityActivityLog, Post, Notify, $timeout) {
        $scope.activityShow = false;
        var inited = false;

		 var loadServices = {
            'community': loadCommunityHome,
            'community.posts': loadCommunityPosts,
            'community.members': loadCommunityMember,
            'community.about': loadCommunityAbout,
            'community.applications': loadCommunityApplications,
            'community.activity-feed': loadCommunityActivityLog,
        };

        function finishLoading() {
            $timeout(function(){
               $scope.subPageLoaded = true;
               
                if(!$scope.$parent)
                    $scope.$parent = {};

               $scope.$parent.loaded = true;
               $rootScope.$emit("subPageLoaded");
            });
        }

        function processData(res) {
            $scope.data = res;
            finishLoading();
        }

        function processDataErr(res) {
            finishLoading();
        }
        
        function loadCommunityAbout(id, done, doneErr) {
            finishLoading();
        }

        function loadCommunityMember(id, doneErr) {

            CommunityMembers.query({communityId: id}, processData, doneErr);
        }

        function loadCommunityApplications(id, doneErr) {

            CommunityApplicants.query({communityId: id}, processData, doneErr);
        }

        function loadCommunityPosts(id, doneErr) {

            Community.getPosts({communityId: id}, function(res) {
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
            $scope.posts.data.forEach(function(item, key) {
                if(item._id === itemNew._id) {
                    $scope.posts.data[key] = itemNew;
                }
            });
        };

        function loadCommunityHome(id) {
            async.parallel([
                function(done) {
                    CommunityActivityLog.get({communityId: id, limit: 5}, function(res) {

                        $scope.activityShow = false;
                        $scope.activityLog = [];
                        $timeout(function() {
                            // console.log("Loaded activity");
                            $scope.activityLog = res;
                            $scope.activityShow = true;
                        });
                        
                        done(null);
                    }, done);
                },
                function(done) {
                    CommunityApplicants.query({communityId: id}, function(res) {
                        $scope.applications = res;
                        done(null);
                    }, done);
                },
                function(done) {
                    Community.getPosts({communityId:id, limit: 5, offset: 0}, function(res) {
                        $scope.posts = res;
                        done(null);
                    }, done);
                }
            ], finishLoading);

            $scope.$on('updatedItem', $scope.refreshItemInfo);
        }

        function loadCommunityActivityLog(id) {

            CommunityActivityLog.get({communityId: id}, processData, processDataErr);
        }
        // =================================== Public Methods ====================================

        $scope.remove = function(item) {
            Post.remove({postId: item._id}, function (res) {

                $scope.$emit('postCreated', item._id); // refresh post list
                $scope.cancel(item);
            }, processDataErr);
        };

        $scope.removeMember = function(id) {
            if($scope.sendingRemoveMember) return false;
            $scope.sendingRemoveMember = true;

            CommunityMembers.remove({communityId: $scope.info._id, memberId: id}, function(res) {
                $scope.sendingRemoveMember = false;
                Notify.addSingleTranslate('NOTIFY.USER_KICKED_FROM_COMMUNITY_SUCCESS', Notify.T_SUCCESS);
                $scope.init();
            }, function(res) {
                $scope.sendingRemoveMember = false;
                Notify.addSingleTranslate('NOTIFY.USER_KICKED_FROM_COMMUNITY_FAILED', Notify.T_ERROR);
            });
        };

        // only hide post .. may be used later for delete revert
        $scope.removeItemFromList = function($event, item) {
            $( "#post_"+item._id ).slideUp( "slow", function() {});
            $scope.init();
        };

        function init() {
            // console.log("Calling load service for segment ", $scope.pageSegment);
            loadServices[$scope.pageSegment]($stateParams.id, processData, processDataErr);

            // refresh after new post created
            if ($scope.pageSegment == 'community' || $scope.pageSegment == 'community.posts') {
                $scope.$on('postCreated', function() {
                    // refresh whole page - load new counters, activity feed, posts list
                    $scope.init();
                    // loadServices[$scope.pageSegment]($stateParams.id, processData, processDataErr);
                });
            }

            // refresh after new post created
            if (! inited && ($scope.pageSegment == 'community' || $scope.pageSegment == 'community.posts')) {
                // console.log("Adding listeners");
                $scope.$on('postCreated', function() {
                    loadServices[$scope.pageSegment]($stateParams.id, processData, processDataErr);
                });
                $scope.$on('postUpdated', function() {
                    loadServices[$scope.pageSegment]($stateParams.id, processData, processDataErr);
                });

                // added event listeners - dont add them again
                inited = true;
            }

        }

        $scope.$on('itemDeleted', $scope.removeItemFromList);
        if($rootScope.communityLoaded)
            init();
        else
            $scope.$on('communityTopPanelLoaded', init);

        $scope.$on('$destroy', function() {
            $rootScope.communityLoaded = false;
        });   
    }
]);