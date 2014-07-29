'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('ProfileCtrl', [
    '$scope', 'Auth', 'flash', 'Errors', '$routeParams', '$location', 'UsersService', '$rootScope', '$timeout', '$window', '$translate', '$analytics', '$q', 'ResponseErrors', 'ProfileProgress', 'Facebook',

    function($scope, Auth, flash, Errors, $routeParams, $location, UsersService, $rootScope, $timeout, $window, $translate, $analytics, $q, ResponseErrors, ProfileProgress, Facebook) {
        var fetchAds, fetchRatings, fetchUser, focusUrl;

        angular.extend($scope, {
            progress: 0,
            rating: {},
            adEditing: false,
            routeParams: $routeParams,
            location: $location,
            languageListDefault: ['en', 'de', 'fr', 'ru', 'es', 'cs'],
            languageList: ['en', 'de', 'fr', 'ru', 'es', 'cs', 'pt', 'ja', 'tr', 'it', 'uk', 'el', 'ro', 'eo', 'hr', 'sk', 'pl', 'bg', 'sv', 'no', 'fi', 'tk', 'ar', 'ko', 'zh']
        });

        $scope.expandAd(null);

        $(document.body).scrollTop(0);

        $scope.$watch('routeParams.action', function(newval) {
            var event,
                credentials = Auth.getCredentials(),
                defaultEvent = 'ads';

            if ((credentials ? credentials._id : void 0) !== $routeParams.id) {
                defaultEvent = 'feedback';
            }
            event = newval || defaultEvent;
            $scope.profilePageType = event;
            return $scope.$broadcast(event + 'Selected');
        });

        $scope.$watch('location.search().id', function(newval) {
            if (newval === undefined || newval === null) {
                return $scope.expandAd(null);
            } else {
                return $scope.ads.forEach(function(item) {
                    if (item._id === newval) {
                        return $scope.expandAd(item);
                    }
                });
            }
        });

        function recountProgress() {
            if (!$scope.profileEditing) {
                var progressData = ProfileProgress.get($scope.profile, pattern);

                $scope.progress = progressData.progress;
                $scope.missingItems = progressData.missing;
            }
        }

        fetchUser = function() {
            $scope.avatar = {};
            return UsersService.get($routeParams.id).then(function(data) {
                if (data._id == null) {
                    $location.path('404');
                }
                if (data && data._type === 'Community') {
                    $location.path('/community/' + data._id);
                }
                $scope.profile = data;
                $scope.avatar = $scope.profile.avatar;
                if ($routeParams.action === 'edit') {
                    $scope.startProfileEdit();
                }
                return $scope.fetchFollows();
            }, function(err) {
                var _ref;
                if ((_ref = err.status) === 400 || _ref === 404 || _ref === 500) {
                    return $location.path('404');
                }
            });
        };
        fetchAds = function(refresh) {
            var searchParams;
            searchParams = {
                userId: $routeParams.id,
                limit: $scope.limit,
                offset: $scope.offset,
                include_not_active: 1
            };
            return UsersService.queryPosts(searchParams).then(function(ads) {
                $scope.lastQueryReturnedCount = ads.length;
                if (refresh || !$scope.ads) {
                    $scope.ads = [];
                }
                return ads.forEach(function(item) {
                    if (item.is_active === undefined) {
                        item.is_active = true;
                    }
                    $scope.ads.push(item);
                    if (($location.search().id != null) && $location.search().id === item._id) {
                        return $scope.expandAd(item);
                    }
                });
            });
        };
        fetchRatings = function() {
            var searchParams;
            searchParams = {
                userId: $routeParams.id,
                limit: $scope.limit,
                offset: $scope.offset
            };
            $scope.ratings = $scope.ratings || [];

            return UsersService.queryRatings(searchParams).then(function(ratings) {
                $scope.lastQueryReturnedCount = ratings.length;
                return ratings.forEach(function(item) {
                    return $scope.ratings.push(item);
                });
            });
        };

        $scope.focusWebInput = function($event) {
            var input = $($event.target);

        	if(!focusUrl) {
	            focusUrl = true;
	            setTimeout(function() {

	            	$(input).focus();
	            }, 50);
        	}

            // firefox hotfix of focus URL
            setTimeout(function() {
            	focusUrl = false;
            }, 100);
        }
        $scope.fetchFollows = function() {
            $scope.showFollow = false;
            $scope.profile.relation = '';
            $scope.relations = {
                followees: [],
                followers: [],
                friends: [],
                communities: []
            };
            if ($scope.loggedUser._id != null) {
                UsersService.isFollower($scope.profile._id, $scope.loggedUser._id).then(function(res) {
                    if (res.isFollower) {
                        $scope.profile.relation = 'followee';
                    }
                    return UsersService.isFriend($scope.profile._id, $scope.loggedUser._id).then(function(res) {
                        if (res.getFriend) {
                            $scope.profile.relation = 'friend';
                            return $scope.profile.relation;
                        }
                    });
                });
                if ($scope.loggedUser._id === $scope.profile._id) {
                    UsersService.queryFollowees($scope.profile._id).then(function(result) {
                        $scope.relations.followees = result || [];
                        return $scope.unifyFollowers();
                    });
                    UsersService.queryFollowers($scope.profile._id).then(function(result) {
                        $scope.relations.followers = result || [];
                        return $scope.unifyFollowers();
                    });
                }
            }
            return UsersService.queryFriends($scope.profile._id).then(function(result) {
                $scope.relations.friends = result.filter(function(item) {
                    return item.userType !== 'Community';
                }) || [];
                $scope.relations.memberOfCommunities = result.filter(function(item) {
                    return item.userType === 'Community';
                }) || [];
                $scope.relations.adminOfCommunities = $scope.relations.memberOfCommunities.filter(function(item) {
                    return item.admin === $scope.profile._id;
                }) || [];
                return $scope.unifyFollowers();
            });
        };
        $scope.unifyFollowers = function() {
            var followee, follower, friends;

            if ($scope.relations) {
                friends = (function() {
                    var i, len,
                        persons = $scope.relations.friends,
                        results = [];

                    for (i = 0, len = persons.length; i < len; i++) {
                        results.push(persons[i].userId);
                    }
                    return results;
                })();
                $scope.relations.followees = (function() {
                    var i, len, id,
                        followees = $scope.relations.followees,
                        results = [];

                    for (i = 0, len = followees.length; i < len; i++) {
                        followee = followees[i];
                        id = followee.userId;
                        if (__indexOf.call(friends, id) < 0 && followee.userType !== 'Community') {
                            results.push(followee);
                        }
                    }
                    return results;
                })();
                $scope.relations.followers = (function() {
                    var i, len, id,
                        followers = $scope.relations.followers,
                        results = [];

                    for (i = 0, len = followers.length; i < len; i++) {
                        follower = followers[i];
                        id = follower.userId;
                        if (__indexOf.call(friends, id) < 0 && follower.userType !== 'Community') {
                            results.push(follower);
                        }
                    }
                    return results;
                })();
                $scope.showFollow = true;
                return $scope.showFollow;
            }
        };
        $scope.$on('adsSelected', function() {
            $scope.init();
            return fetchAds();
        });
        $scope.$on('aboutSelected', function() {
            return $scope.init();
        });
        $scope.$on('adsScrolling', function() {
            return fetchAds();
        });
        $scope.$on('feedbackScrolling', function() {
            return fetchAds();
        });
        $scope.$on('feedbackSelected', function() {
            $scope.init();
            return fetchRatings();
        });
        $scope.$on('removePost', function(event, postId) {
            return $scope.ads.forEach(function(value, index) {
                if (value._id === postId) {
                    return $scope.ads.splice(index, 1);
                }
            });
        });
        $scope.init = function() {
            $scope.limit = 15;
            $scope.offset = 0;
            $scope.lastQueryReturnedCount = 0;
            $scope.ads = [];
            $scope.ratings = [];
            $scope.score = 0;
            return fetchUser();
        };

        function _getIsMine() {
            var isMine = $scope.loggedUser && $routeParams.id === $scope.loggedUser._id,
                isMineCommunity = $scope.loggedCommunity && $routeParams.id === $scope.loggedCommunity._id;

            $scope.isMine = isMine || isMineCommunity;
        }
        $scope.$watch('loggedUser', _getIsMine);
        $scope.$watch('loggedCommunity', _getIsMine);

        var pattern = [{
            name: 'name',
            message: 'MISSING_NAME'
        }, {
            name: 'work',
            message: 'MISSING_WORK'
        }, {
            message: 'MISSING_CONTACT',
            items: [{
                name: 'email'
            }, {
                name: 'phone'
            }]
        }, {
            message: 'MISSING_SOCIAL',
            items: [{
                name: 'facebook'
            }, {
                name: 'twitter'
            }, {
                name: 'googleplus'
            }, {
                name: 'linkedin'
            }]
        }, {
            name: 'interests',
            message: 'MISSING_INTERESTS'
        }, {
            name: 'about',
            message: 'MISSING_ABOUT'
        }, {
            name: 'webs',
            message: 'MISSING_WEBS'
        }, {
            name: 'user_languages',
            message: 'MISSING_USER_LANGUAGES'

        }];

        $scope.$watch('profile', recountProgress, true);

        $scope.$watch('editedProfile', function() {
            $scope.progress = ProfileProgress.get($scope.editedProfile, pattern).progress;
        }, true);

        $scope.disableMoreNotificaton = function($event) {
            $event.stopPropagation();
            $scope.profile.notification_disabled = true;
            $scope.editedProfile = UsersService.clone($scope.profile);
            $scope.editedProfile.notification_disabled = true;
            UsersService.update($scope.editedProfile);
        },

        $scope.showRatingDialog = function(score) {
            $scope.$broadcast('cancelReplyingAd');
            $scope.rating.errors = {};
            $scope.rating.data = {
                id: $scope.profile._id,
                score: score
            };
            if ($scope.profile._id != null) {
                $scope.rating.dialogShown = true;
            }
            $scope.feedbackPlaceholder = $translate(score > 0 ? 'POSITIVE_FEEDBACK_PLACEHOLDER' : 'NEGATIVE_FEEDBACK_PLACEHOLDER');
            return $scope.feedbackPlaceholder;
        };

        $scope.saveRating = function() {
            if ($scope.rating.data.text.length < 3) {
                $scope.rating.errors = {
                    text: 'ERR_RATING_TEXT_MIN_LEN'
                };
                return false;
            }
            delete $scope.rating.errors;
            delete $scope.rating.dialogShown;
            return UsersService.addRating($scope.rating.data).then(function() {
                var event, value;

                flash.success = 'RATING_WAS_SAVED';
                $scope.rating.dialogShown = false;
                $scope.go('feedback');
                if ($scope.rating.data.score > 0) {
                    event = 'send thumb up';
                    value = 25;
                } else {
                    event = 'send thumb down';
                    value = null;
                }
                return $analytics.eventTrack(event, {
                    category: 'Other profile',
                    label: 'thanks',
                    value: value
                });
            }, function(res) {
                return Errors.process(res, $scope.rating);
            });
        };

        /**
         * Solves adding http into URL
         * @param $event event from ngBlur
         */
        $scope.updateUrl = function($event, model, key) {
            var input = $($event.target),
                url = input.val();
            if (url && !url.match(/http[s]?:\/\/.*/))
                url = 'http://' + url;
        	model[key] = url;
        };

        $scope.updateProfile = function() {
            if ($.type($scope.editedProfile.interests) === 'string') {
                $scope.editedProfile.interests = $scope.editedProfile.interests.split(',');
            }

            // hotfix reverse ordrer of adresses
            $scope.editedProfile.locations.reverse();

            return UsersService.update($scope.editedProfile).then(function() {

                $scope.editedProfile.locations.reverse();
                flash.success = 'PROFILE_WAS_UPDATED';
                $scope.profileEditing = false;
                $scope.go('ads');
                return $scope.init();
            }, function(res) {
                $scope.errorsProfile = new ResponseErrors(res);
                return $scope.errorsProfile;
            });
        };
        $scope.startProfileEdit = function() {
            var profile = UsersService.clone($scope.profile);

            angular.extend(profile, {
                webs: profile.webs || [''],
                locations: (!profile.locations || profile.locations.length === 0) ? [{
                    name: ''
                }] : profile.locations
            });

            angular.extend($scope, {
                profileErrors: {},
                profileEditing: true,
                editedProfile: profile
            });
        };
        $scope.cancelProfileEdit = function() {
            $scope.avatar = $scope.profile.avatar;
            $scope.profileEditing = false;
            recountProgress();
        };
        $scope.startProfileDelete = function() {
            angular.extend($scope, {
                profileErrors: {},
                profileEditing: false,
                profileDeleting: true
            });
        };
        $scope.cancelProfileDelete = function() {
            $scope.profileEditing = true;
            $scope.profileDeleting = false;
            return $scope.profileDeleting;
        };
        $scope.deleteProfile = function() {
            return UsersService.remove($scope.profile).then(function() {
                $analytics.eventTrack('delete account confirmed', {
                    category: 'My profile',
                    label: 'delete account confirmed'
                });
                $location.url('feedback?fromDelete');
                return $timeout(function() {
                    return window.location.reload();
                });
            });
        };
        $scope.scrollToTop = function() {
            return $window.scroll(0, 0);
        };
        $scope.avatarUploadStarted = function() {
            $scope.avatarUpload = true;
            return $scope.avatarUpload;
        };
        $scope.avatarUploadSucceeded = function(event) {
            $scope.avatar = angular.fromJson(event.target.responseText);
            $scope.editedProfile.avatar = $scope.avatar;
            $scope.avatarUpload = false;
            return $scope.avatarUpload;
        };
        $scope.avatarUploadFailed = function() {
            $scope.avatarUpload = false;
            flash.error = 'AVATAR_UPLOAD_FAILED';
            return flash.error;
        };
        $scope.loadMore = function(type) {
            if ($scope.lastQueryReturnedCount === $scope.limit) {
                $scope.offset = $scope.offset + $scope.limit;
                return $scope.$broadcast(type + 'Scrolling');
            }
        };
        $scope.go = function(where, params) {
            var path;
            if (where === 'detail' && (params != null)) {
                if ($scope.isMine) {
                    return;
                }
                if (($location.search().id != null) && $location.search().id === params) {
                    return $location.search('id', null);
                } else {
                    return $location.search('id', params);
                }
            } else if (where === 'profile') {
                path = '/profile/' + params;
                return $location.path(path);
            } else {
                path = '/profile/' + $routeParams.id + '/' + where;
                $location.path(path);
                return $scope.$broadcast(where + 'Selected');
            }
        };

        $scope.addWeb = function() {
            $scope.editedProfile.webs.push('');

            setTimeout(function() {
            	$(".urls input").last().focus();
            }, 200);
            // $scope.editedProfile.webs = angular.copy($scope.editedProfile.webs);
        };

        $scope.follow = function(userId, unfollow) {
            var promise;
            if (userId === $scope.loggedUser._id) {
                return;
            }
            promise = null;
            if (unfollow) {
                promise = UsersService.removeFollower(userId, $scope.loggedUser._id);
            } else {
                promise = UsersService.addFollower(userId, $scope.loggedUser._id);
            }
            return promise.then(function() {
                return $scope.fetchFollows();
            });
        };
    }
]);