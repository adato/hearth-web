'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('ProfileDataFeedCtrl', [
	'$scope', '$routeParams', 'Followers', 'Followees', 'UserPosts',
	function($scope, $routeParams, Followers, Followees, UserPosts) {

		console.log($scope.pageSegment);

	}
]);