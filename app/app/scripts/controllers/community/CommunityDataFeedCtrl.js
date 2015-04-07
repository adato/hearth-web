'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityDataFeedCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityDataFeedCtrl', [
	'$scope', '$routeParams', '$rootScope', 'Community', '$route', 'Fulltext', 'CommunityMembers', 'CommunityApplicants', 'CommunityActivityLog', 'Post', 'Notify', '$timeout', 'CommunityRatings',
	function($scope, $routeParams, $rootScope, Community, $route, Fulltext, CommunityMembers, CommunityApplicants, CommunityActivityLog, Post, Notify, $timeout, CommunityRatings) {
        $scope.activityShow = false;
        var inited = false;

		 var loadServices = {
            'community': loadCommunityHome,
            'community.posts': loadCommunityPosts,
            'community.given': loadGivenRatings,
            'community.received': loadReceivedRatings,
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
        	// do nothing
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

        function loadGivenRatings(id, done, doneErr) {
            CommunityRatings.received({communityId: id}, done, doneErr);
        }


        function loadReceivedRatings(id, done, doneErr) {
            $scope.loadedRatingPosts = false;
            $scope.ratingPosts = [];

            CommunityRatings.received({communityId: id}, done, doneErr);
            $scope.$watch('rating.current_community_id', function(val) {
                $scope.rating.post_id = 0;
                CommunityRatings.possiblePosts({_id: id, current_community_id: val}, function(res) {
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
            });

            var removeListener = $scope.$on('$routeChangeStart', function() {
                $scope.closeUserRatingForm();
                removeListener();
            });
        }

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
                    Community.getPosts({communityId:id, limit: 5, offset: 1}, function(res) {
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
            loadServices[$scope.pageSegment]($routeParams.id, processData, processDataErr);

            // refresh after new post created
            if ($scope.pageSegment == 'community' || $scope.pageSegment == 'community.posts') {
                $scope.$on('postCreated', function() {
                    // refresh whole page - load new counters, activity feed, posts list
                    $scope.init();
                    // loadServices[$scope.pageSegment]($routeParams.id, processData, processDataErr);
                });
            }

            // refresh after new post created
            if (! inited && ($scope.pageSegment == 'community' || $scope.pageSegment == 'community.posts')) {
                // console.log("Adding listeners");
                $scope.$on('postCreated', function() {
                    loadServices[$scope.pageSegment]($routeParams.id, processData, processDataErr);
                });
                $scope.$on('postUpdated', function() {
                    loadServices[$scope.pageSegment]($routeParams.id, processData, processDataErr);
                });

                // added event listeners - dont add them again
                inited = true;
            }

        }

        
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
        $scope.addCommunityRating = function($event, item) {
            $scope.data.unshift(item);
            setTimeout(function() {
                $scope.flashRatingBackground(item);
            });
        };


        $scope.$on('communityRatingsAdded', $scope.addCommunityRating);
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