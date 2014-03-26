'use strict';

angular.module('hearth.controllers').controller('SearchCtrl', [
	'$scope', 'UsersService', 'PostsService', '$routeParams', 'flash', '$timeout', '$rootScope', 'Auth', '$location', '$window', 'Geocoder', 'ipCookie', 'Errors', 'FulltextService', 'FolloweesPostsService', 'FolloweesSearchService', 'KeywordsService', '$analytics', 'ResponseErrors',
	function($scope, UsersService, PostsService, $routeParams, flash, $timeout, $rootScope, Auth, $location, $window, Geocoder, ipCookie, Errors, FulltextService, FolloweesPostsService, FolloweesSearchService, KeywordsService, $analytics, ResponseErrors) {
		var processRow, processSearchResults;
		$scope.adEditing = false;
		$scope.location = $location;
		$scope.go = function(where, itemId, authorId) {
			var path;
			if (authorId === $scope.loggedEntity._id) {
				return $location.search('id', null);
			} else {
				if (where === 'detail' && (itemId != null)) {
					if (($location.search().id != null) && $location.search().id === itemId) {
						return $location.search('id', null);
					} else {
						return $location.search('id', itemId);
					}
				} else {
					path = '/' + where + '/' + itemId;
					return $location.path(path);
				}
			}
		};
		$scope.$on('$routeUpdate', function(event, currentRoute) {
			if (($routeParams.id == null) || !$routeParams.id) {
				return $scope.expandAd(null);
			}
		});
		$scope.$on('$routeChangeSuccess', function(event, currentRoute, previousRoute) {
			var orderCookie;
			orderCookie = ipCookie('orderBy') || 'time';
			return $scope.setOrderBy(orderCookie);
		});
		$scope.$watch('location.search().id', function(newval) {
			var item, _i, _len, _ref, _results;
			if (newval === undefined || newval === null) {
				return $scope.expandAd(null, true);
			} else {
				_ref = $scope.items;
				_results = [];
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					item = _ref[_i];
					if (item._id === newval) {
						_results.push($scope.expandAd(item));
					}
				}
				return _results;
			}
		});
		$scope.$watch('location.search().q', function(newval) {
			if ((newval != null) && newval) {
				$scope.srch.query = newval;
				return $rootScope.$broadcast('searchWithRefresh');
			}
		});
		$scope.timeout = null;
		$scope.$on('search', function() {
			if ($scope.timeout) {
				$timeout.clear($scope.timeout);
			}
			return $timeout(function() {
				return $scope.search();
			}, 100);
		});
		$scope.$on('searchWithRefresh', function() {
			$scope.offset = 0;
			return $scope.search({
				add: false
			});
		});
		$scope.refreshSearch = function() {
			return $scope.$broadcast('searchWithRefresh');
		};
		$scope.setOrderBy = function(order) {
			if (order !== 'relevance') {
				$location.search('q', null);
			}
			if (Auth.isLoggedIn() && order === 'location') {
				$scope.initMyLocation();
			}
			$scope.orderBy = order;
			$scope.offset = 0;
			ipCookie('orderBy', order);
			$rootScope.$broadcast('cancelCreatingAd');
			$rootScope.$broadcast('cancelReplyingAd');
			$rootScope.$broadcast('cancelEditingAd');
			return $scope.$broadcast('searchWithRefresh');
		};
		$scope.updateLocation = function(location) {
			$scope.myLocation = location;
			$scope.offset = 0;
			$rootScope.$broadcast('cancelCreatingAd');
			$rootScope.$broadcast('cancelReplyingAd');
			return $scope.$broadcast('searchWithRefresh');
		};
		$scope.initMyLocation = function() {
			var _ref;
			if ((_ref = $scope.myLocation) === undefined || _ref === null || _ref === 0 || _ref === '') {
				return UsersService.get($scope.loggedUser._id).then(function(data) {
					if ((data.location != null) && data.location.type) {
						return $scope.myLocation = Geocoder.geoJsonToLatLon(data.location);
					}
				});
			}
		};
		$scope.initMyFollowers = function() {
			return UsersService.queryFollowees($scope.loggedUser._id).then(function(result) {
				$scope.myFollowees = result || [];
				return UsersService.queryFriends($scope.loggedUser._id);
			}).then(function(result) {
				$scope.myFriends = result || [];
				return $scope.unifyRelations();
			});
		};
		$scope.unifyRelations = function() {
			var item, _i, _j, _len, _len1, _ref, _ref1, _results;
			$scope.myRelations = [];
			_ref = $scope.myFollowees;
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				item = _ref[_i];
				$scope.myRelations.push({
					userId: item.userId,
					relation: 'followee'
				});
			}
			_ref1 = $scope.myFriends;
			_results = [];
			for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
				item = _ref1[_j];
				_results.push($scope.myRelations.push({
					userId: item.userId,
					relation: 'friend'
				}));
			}
			return _results;
		};
		$scope.updateRelations = function(newval) {
			if (newval == null) {
				newval = $scope.myRelations;
			}
			if ((newval == null) || !newval.length) {
				newval = [];
			}
			return $scope.items.map(function(item) {
				var relation, _i, _j, _len, _len1;
				if (item.type === 'user') {
					item.relation = null;
					for (_i = 0, _len = newval.length; _i < _len; _i++) {
						relation = newval[_i];
						if (relation.userId === item._id) {
							item.relation = relation.relation;
						}
					}
				} else if ((item.author != null) && item.author) {
					item.author.relation = null;
					for (_j = 0, _len1 = newval.length; _j < _len1; _j++) {
						relation = newval[_j];
						if (relation.userId === item.author._id) {
							item.author.relation = relation.relation;
						}
					}
				}
				return item;
			});
		};
		$scope.$watch('myRelations', function(newval) {
			return $scope.updateRelations(newval);
		});
		$scope.getRelationship = function(userId) {
			var _ref;
			if ((_ref = $scope.myRelations) != null ? _ref.length : void 0) {
				return $scope.myRelations.map(function(item) {
					if (item.userId === userId) {
						return item.relation;
					}
				});
			}
		};
		$scope.getSearchService = function() {
			var getMarketplaceService, getMyHearthService, searchParams, searchParamsByMyLocation, service;
			searchParams = {
				limit: $scope.limit,
				offset: $scope.offset,
				r: Math.random()
			};
			if (($scope.keywords != null) && $scope.keywords.length) {
				searchParams.keywords = $scope.keywords.join(',');
			}
			service = null;
			searchParamsByMyLocation = function(searchParams) {
				var geo, _ref;
				searchParams.sort = '-distance';
				geo = Geocoder.geoJsonToLatLon($scope.myLocation);
				_ref = [geo.lat, geo.lon], searchParams.lat = _ref[0], searchParams.lon = _ref[1];
				return searchParams;
			};
			getMyHearthService = function() {
				var _ref;
				service = FolloweesPostsService;
				if ($scope.orderBy === 'location' && $scope.myLocation) {
					searchParams = searchParamsByMyLocation(searchParams);
				}
				if ($scope.orderBy === 'relevance' && (((_ref = $scope.srch) != null ? _ref.query : void 0) != null) && $scope.srch.query) {
					searchParams.query = $scope.srch.query;
					if ($scope.srch.type != null) {
						searchParams.type = $scope.srch.type;
					}
					$location.search('q', searchParams.query);
					service = FolloweesSearchService;
				}
				searchParams.userId = $scope.loggedUser._id;
				return service;
			};
			getMarketplaceService = function() {
				var _ref;
				if ($scope.orderBy === 'relevance' && (((_ref = $scope.srch) != null ? _ref.query : void 0) != null) && $scope.srch.query) {
					searchParams.query = $scope.srch.query;
					if ($scope.srch.type != null) {
						searchParams.type = $scope.srch.type;
					}
					$location.search('q', searchParams.query);
					return service = FulltextService;
				} else if ($scope.orderBy === 'location' && $scope.myLocation) {
					searchParams = searchParamsByMyLocation(searchParams);
					return service = PostsService;
				} else {
					return service = PostsService;
				}
			};
			if ($scope.pageType === 'my') {
				service = getMyHearthService();
			}
			if ($scope.pageType !== 'my') {
				service = getMarketplaceService();
			}
			return {
				service: service,
				params: searchParams
			};
		};
		$scope.search = function(options) {
			var search;
			search = $scope.getSearchService();
			$scope.sent = false;
			$scope.searchOptions = options;
			return search.service.query(search.params).then(function(data) {
				var cat, _ref;
				if (search.params.query) {
					cat = $scope.pageType === 'search' ? 'Marketplace' : 'My Hearth';
					$analytics.eventTrack('search by keyword', {
						category: cat
					});
				}
				if ((((_ref = $scope.searchOptions) != null ? _ref.add : void 0) != null) && $scope.searchOptions.add === false) {
					$scope.items = [];
				}
				return processSearchResults(data);
			});
		};
		processSearchResults = function(data) {
			var item, _i, _len;
			for (_i = 0, _len = data.length; _i < _len; _i++) {
				item = data[_i];
				processRow(item);
			}
			$scope.lastQueryReturnedCount = data.length;
			$scope.sent = true;
			return $scope.updateRelations();
		};
		processRow = function(value) {
			var myLocation, postLocation, _ref;
			if (value.type == null) {
				value.type = 'user';
			}
			if (((_ref = value.location) != null ? _ref.type : void 0) === 'Point' && (value.location.name == null)) {
				delete value.location;
			}
			if ($scope.orderBy === 'location' && $scope.myLocation) {
				postLocation = Geocoder.geoJsonToLatLon(value.location);
				myLocation = Geocoder.geoJsonToLatLon($scope.myLocation);
				value.distance = Math.ceil(Geocoder.getDistance(myLocation, postLocation));
			}
			if (($location.search().id != null) && $location.search().id === value._id) {
				$scope.expandAd(value);
			}
			return $scope.items.push(value);
		};
		$scope.setSearchType = function(type) {
			return $scope.srch.type = type;
		};
		$scope.loadMoreAds = function() {
			if ($scope.lastQueryReturnedCount > 0) {
				$scope.offset = $scope.offset + $scope.limit;
				return $scope.$broadcast('search');
			}
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
				return $scope.initMyFollowers();
			});
		};
		$scope.searchByKeyword = function($event, keyword) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.offset = 0;
			if ($scope.keywords.indexOf(keyword) === -1) {
				$scope.keywords.push(keyword);
			} else {
				$scope.keywords.splice($scope.keywords.indexOf(keyword), 1);
			}
			return $scope.search({
				add: false
			});
		};
		$scope.listKeywords = function() {
			return KeywordsService.listKeywords().then(function(data) {
				return $scope.allKeywords = data;
			});
		};
		$scope.init = function() {
			var _ref;
			$scope.limit = 15;
			$scope.offset = 0;
			$scope.keywords = [];
			$scope.lastQueryReturnedCount = 0;
			$scope.srch = {
				query: '',
				filters: [{
					type: 'need',
					name: 'PLURAL_NEEDS'
				}, {
					type: 'offer',
					name: 'PLURAL_OFFERS'
				}, {
					type: 'user',
					name: 'PLURAL_USERS'
				}]
			};
			$scope.sent = false;
			$scope.items = [];
			if (((_ref = $scope.loggedUser) != null ? _ref._id : void 0) != null) {
				$scope.initMyFollowers();
			}
			return $scope.listKeywords();
		};
		$scope.setLastAddedId(null);
		return $scope.init();
	}
]);