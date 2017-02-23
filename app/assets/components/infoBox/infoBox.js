'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.fileUpload
 * @description
 * @restrict A
 */

angular.module('hearth').factory('InfoboxCache', ['$cacheFactory', function($cacheFactory) {
	return $cacheFactory('infobox');
}]);

angular.module('hearth.directives').directive('infoBox', [
	'$rootScope', 'UsersCommunitiesService', '$state', '$analytics', 'IsEmpty', 'ProfileUtils', 'Followees', 'InfoboxCache',
	function($rootScope, UsersCommunitiesService, $state, $analytics, IsEmpty, ProfileUtils, Followees, InfoboxCache) {
		return {
			transclude: true,
			replace: true,
			scope: {
				infoBox: "=",
				infoboxIndex: "=",
				infoboxClass: "=",
			},
			templateUrl: 'assets/components/infoBox/infoBox.html',
			link: function(scope, el, attrs) {
				scope.show = false; // infobox shown
				scope.error = false; // an error occured when loading info
				scope.info = false; // we will cache infobox content
				scope.connections = {
					users: [], // same followees
					userCommunities: [], // same communities
					community: [], // community same members
				}
				scope.getProfileLink = $rootScope.getProfileLink;
				scope.isEmpty = IsEmpty;
				scope.pluralCat = $rootScope.pluralCat;

				/**
				 * Show user info into the box
				 */
				function fillUserInfo(info) {
					scope.info = ProfileUtils.single.copyMottoIfNecessary(info);

					$analytics.eventTrack('InfoBox shown', {
						Id: info._id,
						name: info.name,
						context: $state.current.name
					});
				};

				/**
				 * When loading fail, it will show error message into the box
				 */
				function displayError() {
					scope.error = true;
				};


				function fetchCommunityFollowees() {
					var cacheId = "community_followee_" + scope.infoBox._type + scope.infoBox._id;
					var cached = InfoboxCache.get(cacheId);
					if (cached) {
						scope.connections.community = cached;
						return;
					}

					Followees.fetchCommunityFollowees({
						community_id: scope.infoBox._id,
						logged_user_id: $rootScope.loggedUser._id
					}, function(data) {
						scope.connections.community = data;
						InfoboxCache.put(cacheId, data);
					});
				}

				function fetchCommonFollowees() {
					var cacheId = "common_followee_" + scope.infoBox._type + scope.infoBox._id;
					var cached = InfoboxCache.get(cacheId);
					if (cached) {
						scope.connections.users = cached;
						return;
					}

					Followees.fetchCommonFollowees({
						user_id: scope.infoBox._id,
						logged_user_id: $rootScope.loggedUser._id
					}, function(data) {
						scope.connections.users = data;
						InfoboxCache.put(cacheId, data);
					});
				}

				function fetchCommonCommunities() {
					var cacheId = "common_communities_" + scope.infoBox._type + scope.infoBox._id;
					var cached = InfoboxCache.get(cacheId);
					if (cached) {
						scope.connections.userCommunities = cached;
						return;
					}
					Followees.fetchCommonCommunities({
						user_id: scope.infoBox._id,
						logged_user_id: $rootScope.loggedUser._id
					}, function(data) {
						scope.connections.userCommunities = data;
						InfoboxCache.put(cacheId, data);
					});
				}


				/**
				 * On mouse in, show info box
				 */
				el.on('mouseenter', function() {
					if ($rootScope.loggedUser._id) {
						scope.$apply(function(scope) {
							scope.show = true;
							scope.error = false;

							if (typeof scope.infoBox._type != 'undefined' && scope.infoBox._type == 'Community') {
								fetchCommunityFollowees();
							} else {
								fetchCommonFollowees();
								fetchCommonCommunities();
							}


							UsersCommunitiesService.loadProfileInfo(scope.infoBox, fillUserInfo, displayError);
						});
					}
				});

				/**
				 * On mouse out, hide info box
				 */
				el.on('mouseleave', function() {
					scope.$apply(function(scope) {
						scope.show = false;
					});
				});

			}
		};
	}
]);