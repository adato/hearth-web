'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.SearchCtrl
 * @description
 */

angular.module('hearth.controllers').controller('MapCtrl', [
	'$scope', '$rootScope', '$location', '$window', 'ipCookie', 'Errors', '$analytics', 'geo', 'UsersService', 'Auth',

	function($scope, $rootScope, $location, $window, ipCookie, Errors, $analytics, geo, UsersService, Auth) {
		var self = this;

		console.log($rootScope.filter);

		this.searchParamsOnMap = function(searchParams) {
			return angular.extend(searchParams, {
				sort: 'distance',
				'bounding_box[top_left][lat]': 85,
				'bounding_box[top_left][lon]': -170,
				'bounding_box[bottom_right][lat]': -85,
				'bounding_box[bottom_right][lon]': 175,
				offset: 0,
				r: 0
			});
		}


		this.showMap = function(location) {

			console.log(location);
		};

		this.initMap = function() {

			
		};

		$scope.search = function(options) {
			var search;


			if (search.params.type === 'user') {
				search.params.type = 'user,community';
			}

			return search.service.query(search.params).then(function(data) {
				var i, len = data.length;
				if (search.params.query) {
					$analytics.eventTrack('search by keyword', {
						category: $scope.pageType === 'search' ? 'Marketplace' : 'My Hearth'
					});
				}
				processRow(data[i]);
			});
		};

		$rootScope.$on('searchMap', this.initMap);
	}
]);