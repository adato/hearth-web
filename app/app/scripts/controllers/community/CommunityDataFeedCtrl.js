'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityDataFeedCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityDataFeedCtrl', [
	'$scope', '$stateParams', '$rootScope', 'Community', 'Fulltext', 'CommunityMembers', 'CommunityApplicants', 'CommunityActivityLog', 'Post', 'Notify', '$timeout', 'CommunityRatings', 'UniqueFilter', 'Activities',
	function($scope, $stateParams, $rootScope, Community, Fulltext, CommunityMembers, CommunityApplicants, CommunityActivityLog, Post, Notify, $timeout, CommunityRatings, UniqueFilter, Activities) {
        $scope.activityShow = false;
        $scope.loadingData = false;
        var ItemFilter = new UniqueFilter();

        var inited = false;
        var loadServices = {
            'home': loadCommunityHome,
            'posts': loadCommunityPosts,
            'members': loadCommunityMember,
            'about': loadCommunityAbout,
            'applications': loadCommunityApplications,
            'activity': loadCommunityActivityLog,
            'given-ratings': loadGivenRatings,
            'received-ratings': loadReceivedRatings,
        };

        $scope.loadBottom = function() {
            $scope.loadingData = true;
            loadServices[$scope.pageSegment]($stateParams.id, processData, processDataErr);
        };

        // send rating to API
        $scope.sendRating = function(ratingOrig) {
            var rating;
            var ratings = {
                false: -1,
                true: 1
            };

            $scope.showError.text = false;

            if(!ratingOrig.text)
                return $scope.showError.text = true;

            // transform rating.score value from true/false to -1 and +1
            rating = angular.copy(ratingOrig);
            rating.score = ratings[rating.score];
            rating.post_id = rating.post_id || null;

            var out = {
                current_community_id: rating.current_community_id,
                id: $scope.info._id,
                rating: rating
            };

            // lock - dont send twice
            if($scope.sendingRating)
                return false;
            $scope.sendingRating = true;

            // send rating to API
            CommunityRatings.add(out, function(res) {

                // remove lock
                $scope.sendingRating = false;

                // close form
                $scope.closeUserRatingForm();

                // broadcast new rating - this will add rating to list
                $scope.$broadcast('communityRatingsAdded', res);
                // Notify.addSingleTranslate('NOTIFY.USER_RATING_SUCCESS', Notify.T_SUCCESS);

            }, function(err) {
                // remove lock
                $scope.sendingRating = false;

                // handle error
                Notify.addSingleTranslate('NOTIFY.USER_RATING_FAILED', Notify.T_ERROR, '.rating-notify-box');
            });
        };

        function finishLoading(res) {
            $timeout(function(){
               $scope.subPageLoaded = true;
               
                if(!$scope.$parent)
                    $scope.$parent = {};

               $scope.$parent.loaded = true;
               $rootScope.$emit("subPageLoaded");
            });

            if(res && res.length)
                $scope.loadingData = false;
        }

        function processData(res) {
            res = ItemFilter.filter(res);

            $scope.data = $scope.data.concat(res);
            finishLoading(res);
        }

        function processDataErr(res) {
            finishLoading([]);
        }
        
        function loadGivenRatings(id, done, doneErr) {
            var obj = {
                communityId: id,
                limit: 10,
                offset: $scope.data.length
            };
            
            CommunityRatings.given(obj, done, doneErr);
        }

        function loadReceivedRatings(id, done, doneErr) {
            var obj = {
                communityId: id,
                limit: 10,
                offset: $scope.data.length
            };

            $scope.loadedRatingPosts = false;
            $scope.ratingPosts = [];

            CommunityRatings.received(obj, done, doneErr);
            $scope.$watch('rating.current_community_id', function(val) {
                $scope.rating.post_id = 0;
                CommunityRatings.possiblePosts({_id: id, current_community_id: val}, function(res, headers) {
                    var posts = [];
                    if(!res.needed || !res.offered)
                        console.error('Undefined needed/offered posts: ', res, headers)

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

        function loadCommunityAbout(id, done, doneErr) {
            finishLoading([]);
        }

        function loadCommunityMember(id, doneErr) {
            var obj = {
                communityId: id,
                limit: 12,
                offset: $scope.data.length
            };

            CommunityMembers.query(obj, processData, doneErr);
        }

        function loadCommunityApplications(id, doneErr) {
            var obj = {
                communityId: id,
                limit: 12,
                offset: $scope.data.length
            };

            CommunityApplicants.query(obj, processData, doneErr);
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

                            res.map(function(activity) {
                                activity.text = Activities.getActivityTranslation(activity);
                                return activity;
                            });

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
            ItemFilter.clear();
            $scope.loadingData = true;
            $scope.data = [];
            $scope.pageSegment = $stateParams.page || 'home';
            var loadService = loadServices[$scope.pageSegment];

            // console.log("Calling load service for segment ", $scope.pageSegment);
            loadService($stateParams.id, processData, processDataErr);

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
                $scope.$on('postCreated', function() {
                    loadService($stateParams.id, processData, processDataErr);
                });
                $scope.$on('postUpdated', function() {
                    loadService($stateParams.id, processData, processDataErr);
                });

                // added event listeners - dont add them again
                inited = true;
            }
        }

        // will add new rating to data array
        $scope.addCommunityRating = function($event, item) {
            $scope.data.unshift(item);
            $scope.flashRatingBackground(item);
        };

        $scope.$on('refreshSubpage', init);
        $scope.$on('communityRatingsAdded', $scope.addCommunityRating);
        $scope.$on('itemDeleted', $scope.removeItemFromList);
        init();
    }
]);