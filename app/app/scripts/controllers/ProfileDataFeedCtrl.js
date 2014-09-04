'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('ProfileDataFeedCtrl', [
	'$scope', '$routeParams', 'Followers', 'Followees', 'UserPosts', 'UsersCommunitiesService', 'UserRatings',
	function($scope, $routeParams, Followers, Followees, UserPosts, UsersCommunitiesService, UserRatings) {
		var loadServices = {
            'profile': loadUserHome,
            'profile.posts': UserPosts.get,
            'profile.communities': UsersCommunitiesService.get,
            'profile.given': UserRatings.given,
            'profile.received': UserRatings.received,
            'profile.following': Followees.query,
            'profile.followers': Followers.query
        }

        function loadUserHome(params, done, doneErr) {
    		alert("HOME");
    		done({});
        }

        function processData(res) {

        	$scope.data = res;
        }

        function processDataErr(res) {

        	console.log("Err", res);
        }

        console.log("Calling load service", $scope.pageSegment);
        loadServices[$scope.pageSegment]({user_id: $routeParams.id}, processData, processDataErr);
	}
]);