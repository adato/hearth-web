var __indexOf = [].indexOf || function(item) {
		for (var i = 0, l = this.length; i < l; i++) {
			if (i in this && this[i] === item) return i;
		}
		return -1;
	};

angular.module('hearth.controllers', []).controller('BaseCtrl', ['$scope', '$location', '$route', 'Auth', 'flash', 'PostsService', 'Errors', '$timeout', '$window', '$rootScope', '$routeParams', 'LanguageSwitch', '$q', '$translate', 'UsersService', 'Info', '$analytics', 'ResponseErrors', 'ipCookie',
	function($scope, $location, $route, Auth, flash, PostsService, Errors, $timeout, $window, $rootScope, $routeParams, LanguageSwitch, $q, $translate, UsersService, Info, $analytics, ResponseErrors, ipCookie) {
		$scope.breakpointForSmall = 782;
		$scope.defaultPageType = '';
		$scope.pageType = $scope.defaultPageType;
		$scope.facebookLoginUrl = $$config.apiPath + '/auth/facebook';
		$scope.googleLoginUrl = $$config.apiPath + '/users/auth/google_oauth2';
		$scope.notifications = {};
		$scope.init = function() {
			$scope.navigator = navigator;
			$scope.flash = flash;
			$scope.languages = LanguageSwitch.getLanguages();
			$scope.languageCode = LanguageSwitch.uses();
			$scope.info = Info.show();
			return $scope.checkNotifications();
		};
		$scope.$on('$routeChangeSuccess', function(event, currentRoute) {
			return $scope.pageType = currentRoute.pageType ? currentRoute.pageType : $location.path() === '/' ? $scope.defaultPageType : void 0;
		});
		$scope.useLanguage = function(language) {
			return LanguageSwitch.use(language).then(function() {
				return $scope.languageCode = language;
			});
		};
		$scope.expandAd = function(ad, force) {
			var formScope, _ref;
			formScope = angular.element($('form[name=replyForm]')).scope();
			if (formScope != null) {
				if (formScope.replyForm != null) {
					formScope.replyForm.$setPristine();
				}
				if (formScope.errors != null) {
					delete formScope.errors;
				}
			}
			$scope.replyToAdSubmitted = false;
			$rootScope.$broadcast('cancelReplyingAd');
			if (ad === null || (($scope.ad != null) && $scope.ad._id === ad._id)) {
				$scope.ad = null;
				if ((force != null) && force) {
					$location.search('id', null);
				}
				$rootScope.$broadcast('scrollIntoView');
				return;
			}
			$scope.scrollTop = $(window).scrollTop();
			$rootScope.$broadcast('startReplyingAd');
			$scope.ad = ad;
			$scope.reply = {
				id: ad._id,
				message: '',
				agreed: true
			};
			$location.search('id', ad._id);
			return $scope.agreeTranslationData = {
				name: (_ref = ad.author) != null ? _ref.name : void 0
			};
		};
		$scope.replyToAd = function(ad) {
			if (($scope.reply.message != null) && $scope.reply.message.length < 3) {
				this.errors = new ResponseErrors({
					status: 400,
					data: {
						name: 'ValidationError',
						message: 'ERR_REPLY_EMPTY_MESSAGE'
					}
				});
				return;
			}
			if (($scope.reply.agreed != null) && $scope.reply.agreed === false) {
				this.errors = new ResponseErrors({
					status: 400,
					data: {
						name: 'ValidationError',
						message: 'ERR_REPLY_PLEASE_AGREE'
					}
				});
			}
			if (!this.replyForm.$valid) {
				return;
			}
			$scope.replyToAdSubmitting = true;
			return PostsService.reply($scope.reply).then(function(data) {
				$scope.replyToAdSubmitting = false;
				$scope.replyToAdSubmitted = true;
				return $timeout(function() {
					$scope.ad = null;
					$rootScope.$broadcast('cancelReplyingAd');
					return delete this.errors;
				}, 8000);
			}).then(null, function(res) {
				delete this.errors;
				return $scope.replyToAdSubmitting = false;
			});
		};
		$scope.removeAd = function(wish) {
			var event;
			if (confirm($translate('AD_REMOVE_ARE_YOU_SURE'))) {
				event = wish.type === 'need' ? 'delete wish' : 'delete offer';
				$analytics.eventTrack(event, {
					category: 'Posting',
					label: 'NP'
				});
				return PostsService.remove(wish).then(function() {
					$rootScope.$broadcast('removePost', wish._id);
					return $scope.flash.success = $translate('AD_REMOVE_DONE');
				}).then(null, function() {
					return $scope.flash.error = $translate('AD_REMOVE_CANNOT_BE_REMOVED');
				});
			}
		};
		$scope.setLastAddedId = function(id) {
			return $scope.lastAddedId = id;
		};
		$scope.getLastAddedId = function() {
			return $scope.lastAddedId;
		};
		$scope.escapeKey = function($event) {
			if ($event.keyCode === 27) {
				$rootScope.$broadcast('cancelReplyingAd');
				$rootScope.$broadcast('cancelCreatingAd');
				return $rootScope.$broadcast('cancelEditingAd');
			}
		};
		$scope.routeParamsAdIsNotNull = function() {
			return ($location.search().id != null) && $location.search().id;
		};
		$scope.sidebarVisible = function(val) {
			if (val != null) {
				$scope.sidebarIsVisible = val;
			}
			return $scope.sidebarIsVisible;
		};
		$scope.dismissNotification = function(notification) {
			if ($scope.notifications[notification]) {
				$scope.notifications[notification] = false;
				return ipCookie(notification, false);
			}
		};
		return $scope.checkNotifications = function() {
			if (ipCookie('newCommunityCreated') === true) {
				$scope.notifications.newCommunityCreated = true;
				return ipCookie('newCommunityCreated', false);
			}
		};
	}
]).controller('SearchCtrl', [
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
]).controller('CreatePostCtrl', [
	'$scope', 'Geocoder', 'Errors', '$q', 'PostsService', '$analytics', 'ResponseErrors', '$timeout', '$window',
	function($scope, Geocoder, Errors, $q, PostsService, $analytics, ResponseErrors, $timeout, $window) {
		$scope.defaultPost = {
			type: 'offer',
			keywords: []
		};
		$scope.post = $scope.defaultPost;
		$scope.$on('setDefaultPost', function($event, newitem) {
			var save;
			$scope.post = angular.copy(newitem || $scope.defaultPost);
			save = function() {
				$scope.post = this;
				return $scope.createAd();
			};
			return $scope.post.save = save;
		});
		$scope.setDefaultPost = function(item) {
			return $scope.$broadcast('setDefaultPost', item);
		};
		$scope.createAd = function() {
			var query;
			if (($scope.post != null) && ($scope.post.name != null) && ($scope.post.name.length != null)) {
				if ($scope.post.name.length < 3) {
					return $scope.errors = new ResponseErrors({
						status: 400,
						data: {
							name: 'ValidationError',
							errors: {
								name: {
									name: 'ValidatorError',
									type: 'ERR_AD_NAME_MIN_LEN'
								}
							}
						}
					});
				} else {
					$scope.sending = true;
					if ($scope.post._id) {
						query = $scope.updatePost($scope.post);
					} else {
						query = $scope.createPost($scope.post);
					}
					return query.then(function(createdItem) {
						$scope.$emit('cancelCreatingAd');
						$scope.$emit('cancelEditingAd');
						$window.location.reload();
						$scope.sending = false;
						if ($scope.createAdForm != null) {
							$scope.createAdForm.$setPristine();
						}
						return delete $scope.errors;
					}, function(err) {
						return $scope.errors = new ResponseErrors(err);
					});
				}
			}
		};
		$scope.autodetectPosition = function() {
			return Geocoder.findMeAndGeocode().then(function(geocodedLocation) {
				return $scope.post.location = Geocoder.latLonToGeoJson(geocodedLocation);
			});
		};
		$scope.photoUploadSuccessful = function($event) {
			var _ref, _ref1;
			if ((((_ref = $event.target) != null ? _ref.response : void 0) != null) && ((_ref1 = $event.target.status) !== 404 && _ref1 !== 403 && _ref1 !== 500)) {
				return $scope.post.attachments = [JSON.parse($event.target.response)];
			}
		};
		$scope.createPost = function(post) {
			var deferred, event;
			deferred = $q.defer();
			$scope.sent = false;
			PostsService.add(post).then(function(data) {
				if (data) {
					$scope.sent = true;
				}
				$scope.setLastAddedId(data._id);
				$scope.error = null;
				$scope.sending = false;
				return deferred.resolve(data);
			}, function(err) {
				$scope.sending = false;
				return deferred.reject(err);
			});
			event = post.type === 'need' ? 'post new wish' : 'post new offer';
			$analytics.eventTrack(event, {
				category: 'Posting',
				label: 'NP',
				value: 7
			});
			return deferred.promise;
		};
		return $scope.updatePost = function(post) {
			var deferred, event;
			deferred = $q.defer();
			$scope.sent = false;
			PostsService.update(post).then(function(data) {
				if (data) {
					$scope.sent = true;
				}
				$scope.error = null;
				return deferred.resolve(data);
			}, function(err) {
				$scope.sending = false;
				return deferred.reject(err);
			});
			event = post.type === 'need' ? 'update wish' : 'update offer';
			$analytics.eventTrack(event, {
				category: 'Posting',
				label: 'NP',
				value: 7
			});
			return deferred.promise;
		};
	}
]).controller('ListViewStateCtrl', [
	'$scope', '$timeout', '$window', '$location',
	function($scope, $timeout, $window, $location) {
		$scope.isAdBeingCreated = false;
		$scope.isAdBeingEdited = false;
		$scope.editId = null;
		$scope.isCreatingAd = function() {
			return $scope.isAdBeingCreated;
		};
		$scope.isReplyingAd = function() {
			return $scope.isAdBeingReplied;
		};
		$scope.startCreatingAd = function() {
			if ($scope.createAdForm != null) {
				$scope.createAdForm.$setPristine();
				delete $scope.errors;
			}
			if ($scope.isCreatingAd() || $scope.isEditingAd()) {
				return;
			}
			$scope.$broadcast('setDefaultPost');
			$scope.$broadcast('startCreatingAd');
			$scope.$broadcast('cancelReplyingAd');
			return $scope.$broadcast('cancelEditingAd');
		};
		$scope.$on('cancelCreatingAd', function() {
			return $scope.isAdBeingCreated = false;
		});
		$scope.$on('startCreatingAd', function() {
			$scope.isAdBeingCreated = true;
			$scope.$broadcast('setDefaultPost');
			if ($scope.isReplyingAd()) {
				return $scope.$broadcast('cancelReplyingAd');
			}
		});
		$scope.$on('cancelReplyingAd', function() {
			delete $location.search().id;
			return $scope.isAdBeingReplied = false;
		});
		$scope.$on('startReplyingAd', function() {
			$scope.isAdBeingReplied = true;
			if ($scope.isCreatingAd()) {
				$scope.$broadcast('cancelCreatingAd');
			}
			if ($scope.isEditingAd()) {
				$scope.$broadcast('cancelEditingAd');
			}
			return $timeout(function() {
				if ($window.innerWidth < $scope.breakpointForSmall) {
					return window.scroll(0, 0);
				}
			});
		});
		$scope.startEditingAd = function($event, post) {
			$scope.editId = post._id;
			$scope.$broadcast('startEditingAd');
			$scope.$broadcast('cancelCreatingAd');
			$scope.$broadcast('cancelReplyingAd');
			$event.stopPropagation();
			return $event.preventDefault();
		};
		$scope.$on('startEditingAd', function() {
			return $scope.isAdBeingEdited = true;
		});
		$scope.$on('cancelEditingAd', function() {
			$scope.$broadcast('setDefaultPost');
			$scope.editId = null;
			return $scope.isAdBeingEdited = false;
		});
		$scope.isEditingAd = function(id) {
			if (id == null) {
				return $scope.isAdBeingEdited;
			}
			return $scope.isAdBeingEdited && $scope.editId === id;
		};
		return $scope.$on('scrollIntoView', function() {
			return $timeout(function() {
				if ($window.innerWidth < $scope.breakpointForSmall) {
					return window.scroll(0, $scope.scrollTop);
				}
			});
		});
	}
]).controller('ProfileCtrl', [
	'$scope', 'Auth', 'flash', 'Errors', '$routeParams', '$location', 'UsersService', '$rootScope', '$timeout', 'Geocoder', '$window', '$translate', '$analytics', '$q', 'ResponseErrors',
	function($scope, Auth, flash, Errors, $routeParams, $location, UsersService, $rootScope, $timeout, Geocoder, $window, $translate, $analytics, $q, ResponseErrors) {
		var fetchAds, fetchRatings, fetchUser;
		$scope.rating = {};
		$scope.adEditing = false;
		$scope.expandAd(null);
		$scope.routeParams = $routeParams;
		$scope.location = $location;
		$scope.$watch('routeParams.action', function(newval) {
			var defaultEvent, event, _ref;
			defaultEvent = 'ads';
			if (((_ref = Auth.getCredentials()) != null ? _ref._id : void 0) !== $routeParams.id) {
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
		fetchUser = function() {
			$scope.avatar = {};
			return UsersService.get($routeParams.id).then(function(data) {
				if (data._id == null) {
					$location.path('404');
				}
				if ((data._type != null) && data._type === 'Community') {
					$location.path('/community/' + data._id);
				}
				$scope.profile = data;
				$scope.avatar = $scope.profile.avatar;
				if ($routeParams.action === 'edit') {
					$scope.startProfileEdit;
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
				offset: $scope.offset
			};
			return UsersService.queryPosts(searchParams).then(function(ads) {
				$scope.lastQueryReturnedCount = ads.length;
				if (refresh || ($scope.ads == null)) {
					$scope.ads = [];
				}
				return ads.forEach(function(item) {
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
			if ($scope.ratings == null) {
				$scope.ratings = [];
			}
			return UsersService.queryRatings(searchParams).then(function(ratings) {
				$scope.lastQueryReturnedCount = ratings.length;
				return ratings.forEach(function(item) {
					return $scope.ratings.push(item);
				});
			});
		};
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
							return $scope.profile.relation = 'friend';
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
				return $scope.unifyFollowers();
			});
		};
		$scope.unifyFollowers = function() {
			var followee, follower, friends, person;
			if ($scope.relations != null) {
				friends = (function() {
					var _i, _len, _ref, _results;
					_ref = $scope.relations.friends;
					_results = [];
					for (_i = 0, _len = _ref.length; _i < _len; _i++) {
						person = _ref[_i];
						_results.push(person.userId);
					}
					return _results;
				})();
				$scope.relations.followees = (function() {
					var _i, _len, _ref, _ref1, _results;
					_ref = $scope.relations.followees;
					_results = [];
					for (_i = 0, _len = _ref.length; _i < _len; _i++) {
						followee = _ref[_i];
						if ((_ref1 = followee.userId, __indexOf.call(friends, _ref1) < 0) && followee.userType !== 'Community') {
							_results.push(followee);
						}
					}
					return _results;
				})();
				$scope.relations.followers = (function() {
					var _i, _len, _ref, _ref1, _results;
					_ref = $scope.relations.followers;
					_results = [];
					for (_i = 0, _len = _ref.length; _i < _len; _i++) {
						follower = _ref[_i];
						if ((_ref1 = follower.userId, __indexOf.call(friends, _ref1) < 0) && follower.userType !== 'Community') {
							_results.push(follower);
						}
					}
					return _results;
				})();
				return $scope.showFollow = true;
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
			var _ref, _ref1;
			$scope.limit = 15;
			$scope.offset = 0;
			$scope.lastQueryReturnedCount = 0;
			$scope.ads = [];
			$scope.ratings = [];
			$scope.score = 0;
			$rootScope.isMine = $routeParams.id === ((_ref = $scope.loggedUser) != null ? _ref._id : void 0) && !((_ref1 = $scope.loggedCommunity) != null ? _ref1._id : void 0);
			return fetchUser();
		};
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
			if (score > 0) {
				return $scope.feedbackPlaceholder = $translate('POSITIVE_FEEDBACK_PLACEHOLDER');
			} else {
				return $scope.feedbackPlaceholder = $translate('NEGATIVE_FEEDBACK_PLACEHOLDER');
			}
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
			return UsersService.addRating($scope.rating.data).then(function(data) {
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
		$scope.updateProfile = function() {
			return UsersService.update($scope.editedProfile).then(function() {
				flash.success = 'PROFILE_WAS_UPDATED';
				$scope.profileEditing = false;
				$scope.go('ads');
				return $scope.init();
			}, function(res) {
				return $scope.errorsProfile = new ResponseErrors(res);
			});
		};
		$scope.startProfileEdit = function() {
			$scope.editedProfile = UsersService.clone($scope.profile);
			$scope.profileErrors = {};
			return $scope.profileEditing = true;
		};
		$scope.cancelProfileEdit = function() {
			$scope.avatar = $scope.profile.avatar;
			return $scope.profileEditing = false;
		};
		$scope.startProfileDelete = function() {
			$scope.profileErrors = {};
			$scope.profileEditing = false;
			return $scope.profileDeleting = true;
		};
		$scope.cancelProfileDelete = function() {
			$scope.profileEditing = true;
			return $scope.profileDeleting = false;
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
			return $scope.avatarUpload = true;
		};
		$scope.avatarUploadSucceeded = function(event) {
			$scope.avatar = angular.fromJson(event.target.responseText);
			$scope.editedProfile.avatar = $scope.avatar;
			return $scope.avatarUpload = false;
		};
		$scope.avatarUploadFailed = function() {
			$scope.avatarUpload = false;
			return flash.error = 'AVATAR_UPLOAD_FAILED';
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
		return $scope.follow = function(userId, unfollow) {
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
]).controller('RegisterCtrl', [
	'$scope', 'LanguageSwitch', 'User', 'ResponseErrors', '$analytics', 'Auth', '$location', 'flash',
	function($scope, LanguageSwitch, User, ResponseErrors, $analytics, Auth, $location, flash) {
		if (Auth.isLoggedIn()) {
			$location.path('profile/' + Auth.getCredentials()._id);
			return;
		}
		$scope.sent = false;
		$scope.sending = false;
		$scope.user = new User();
		$scope.errors = new ResponseErrors();
		return $scope.register = function($event) {
			if (!$scope.registerForm.$valid) {
				return;
			}
			$scope.errors = new ResponseErrors();
			$scope.user.language = LanguageSwitch.uses();
			$scope.sending = true;
			return $scope.user.$save(function() {
				$scope.sent = true;
				$scope.sending = false;
				return $analytics.eventTrack('registration email sent', {
					category: 'registration',
					label: 'registration email sent'
				});
			}, function(err) {
				$scope.errors = new ResponseErrors(err);
				$scope.sent = false;
				$scope.sending = false;
				return $analytics.eventTrack('error during registration', {
					category: 'registration',
					label: 'error during registration'
				});
			});
		};
	}
]).controller('LoginCtrl', [
	'$scope', '$location', '$routeParams', '$translate', 'Auth', 'ResponseErrors', '$rootScope',
	function($scope, $location, $routeParams, $translate, Auth, ResponseErrors, $rootScope) {
		return Auth.init(function() {
			if (Auth.isLoggedIn()) {
				$location.path($rootScope.referrerUrl || 'profile/' + Auth.getCredentials()._id);
				return;
			}
			$scope.credentials = {
				username: '',
				password: ''
			};
			$translate('ERR_NOT_AUTHN');
			$translate('ERR_NOT_AUTHZ');
			return $scope.errors = new ResponseErrors($routeParams.reason ? {
				status: 400,
				data: {
					name: 'ValidationError',
					message: 'ERR_' + $routeParams.reason.toUpperCase().replace('-', '_')
				}
			} : null);
		});
	}
]).controller('ConfirmEmailCtrl', [
	'$scope', '$location', 'Auth', 'flash', '$analytics',
	function($scope, $location, Auth, flash, $analytics) {
		var search;
		$scope.hashIsValid = false;
		$scope.loaded = false;
		$scope.missingHash = true;
		search = $location.search();
		if (search.hash) {
			$scope.missingHash = false;
			return Auth.confirmRegistration(search.hash, function(data) {
				flash.success = 'EMAIL_CONFIRMATION_SUCCESS';
				$analytics.eventTrack('registration email confirmed', {
					category: 'registration',
					label: 'registration email confirmed'
				});
				return $location.path('login');
			}, function(res) {
				flash.error = 'EMAIL_CONFIRMATION_FAILURE';
				$analytics.eventTrack('registration email failed', {
					category: 'registration',
					label: 'registration email failed'
				});
				return $scope.loaded = true;
			});
		}
	}
]).controller('ChangePwdCtrl', [
	'$scope', 'flash', '$location', 'Auth',
	function($scope, flash, $location, Auth) {
		return $scope.save = function() {
			var loggedUser;
			if (!$scope.changePwdForm.$invalid) {
				$scope.errors = [];
				if ($scope.password1 !== $scope.password2) {
					return $scope.errors.push({
						param: 'password',
						msg: 'ERR_PASSWORDS_DONT_MATCH'
					});
				} else {
					loggedUser = Auth.getCredentials();
					return Auth.changePassword($scope.password1, function(data) {
						flash.success = 'PASSWORD_WAS_CHANGED';
						return $location.path('profile/' + loggedUser._id);
					}, function(res) {
						return $scope.errors.push('PASSWORD_CHANGE_FAILED');
					});
				}
			}
		};
	}
]).controller('ForgottenPasswordCtrl', [
	'$scope', 'Auth', 'flash', '$location', '$translate', 'ResponseErrors',
	function($scope, Auth, flash, $location, $translate, ResponseErrors) {
		$scope.passwordResetRequest = {
			email: ''
		};
		$scope.errors = new ResponseErrors();
		return $scope.requestPasswordReset = function() {
			if (!$scope.forgottenPasswordForm.$valid) {
				return;
			}
			$scope.errors = new ResponseErrors();
			return Auth.requestPasswordReset($scope.passwordResetRequest.email).success(function(data) {
				$translate('FORGOTTEN_PASSWORD_EMAIL_SUCCESS');
				flash.success = 'FORGOTTEN_PASSWORD_EMAIL_SUCCESS';
				return $location.path('login');
			}).error(function(data, status) {
				return $scope.errors = new ResponseErrors({
					data: data,
					status: status
				});
			});
		};
	}
]).controller('ResetPwdCtrl', [
	'$scope', 'Auth', '$location', 'flash',
	function($scope, Auth, $location, flash) {
		$scope.init = function() {
			var search;
			search = $location.search();
			$scope.hash = search.hash;
			if (!$scope.hash) {
				flash.error = 'MISSING_PASSWORD_RESET_HASH';
				return $location.path('login');
			}
		};
		return $scope.resetPwd = function() {
			var onError, onSuccess;
			$scope.error = false;
			if (!$scope.resetPwdForm.$invalid) {
				if ($scope.password1 !== $scope.password2) {
					return $scope.error = 'ERR_PASSWORDS_DONT_MATCH';
				} else {
					onSuccess = function(data) {
						flash.success = 'PASSWORD_RESET_SUCCESS';
						return $location.path('login');
					};
					onError = function(data) {
						return $scope.error = data;
					};
					return Auth.resetPassword($scope.hash, $scope.password1, onSuccess, onError);
				}
			}
		};
	}
]).controller('FeedbackCtrl', [
	'$scope', 'Auth', 'User', '$timeout', '$location', 'Feedback', 'ResponseErrors',
	function($scope, Auth, User, $timeout, $location, Feedback, ResponseErrors) {
		$scope.init = function() {
			$scope.sent = false;
			$scope.sending = false;
			$scope.feedback = {
				text: '',
				email: ''
			};
			$scope.errors = new ResponseErrors();
			if (($location.search().fromDelete != null) && $location.search().fromDelete) {
				$scope.fromAccountDelete = true;
			}
			if (!$scope.loggedUser.loggedIn) {
				return;
			}
			return User.get({
				userId: $scope.loggedUser._id
			}, function(data) {
				$scope.feedback.email = data.email;
				return $scope.feedback.name = data.name;
			});
		};
		$scope.submit = function() {
			if (!$scope.feedbackForm.$valid) {
				return;
			}
			$scope.sending = true;
			return Feedback.add($scope.feedback, function(data) {
				$scope.feedbackForm.$setPristine();
				return $scope.sent = true;
			}, function() {
				$scope.feedbackForm.$setPristine();
				return $scope.init();
			});
		};
		return $scope.init();
	}
]).controller('TermsCtrl', [
	'$scope', 'LanguageSwitch',
	function($scope, LanguageSwitch) {
		$scope.showButton = true;
		var updateTermsPath;
		updateTermsPath = function() {
			return $scope.termsPath = '../locales/' + LanguageSwitch.uses() + '/terms.html';
		};
		$scope.$watch(function() {
			return LanguageSwitch.uses();
		}, updateTermsPath);
		return updateTermsPath();
	}
]).controller('SetupCtrl', [
	'$scope', '$feature', 'ipCookie',
	function($scope, $feature, ipCookie) {
		$scope.features = Object.keys($$config.features).map(function(name) {
			return {
				name: name,
				value: $feature.isEnabled(name)
			};
		});
		return $scope.toggle = function(name) {
			var features;
			return features = $scope.features.filter(function(feature) {
				return feature.name === name;
			}).forEach(function(feature) {
				var _ref;
				if ($$config.features[name] !== feature.value) {
					return ipCookie('FEATURE_' + feature.name, (_ref = feature.value) != null ? _ref : {
						'1': ''
					});
				} else {
					return ipCookie('FEATURE_' + feature.name, void 0);
				}
			});
		};
	}
]).controller('CommunityProfileCtrl', [
	'$scope', '$routeParams', '$location', 'CommunityService', 'UsersService', '$rootScope', 'ResponseErrors', 'Errors', 'flash', '$translate', '$window', '$analytics',
	function($scope, $routeParams, $location, CommunityService, UsersService, $rootScope, ResponseErrors, Errors, flash, $translate, $window, $analytics) {
		var init;
		$scope.errorsUpdateCommunity = null;
		$scope.editingCommunity = false;
		$scope.routeParams = $routeParams;
		$scope.profilePageType = 'ads';
		$scope.location = $location;
		$scope.fetchProfile = function() {
			$rootScope.isMine = false;
			return CommunityService.get($routeParams.id).then(function(data) {
				$scope.community = $scope.profile = data;
				return UsersService.get($scope.community.admin).then(function(data) {
					var _ref;
					$scope.communityAdmin = data;
					if (((_ref = $rootScope.loggedCommunity) != null ? _ref._id : void 0) === $scope.community._id) {
						$rootScope.isMine = true;
					}
					return $scope.fetchMembers();
				}, function(err) {
					var _ref;
					if ((_ref = err.status) === 400 || _ref === 404 || _ref === 500) {
						return $location.path('404');
					}
				});
			}, function(err) {
				var _ref;
				if ((_ref = err.status) === 400 || _ref === 404 || _ref === 500) {
					return $location.path('404');
				}
			});
		};
		$scope.fetchMembers = function() {
			return CommunityService.queryMembers($routeParams.id).then(function(data) {
				$scope.communityMembers = data;
				if (!$rootScope.isMine) {
					CommunityService.getApplicant($routeParams.id, $scope.loggedUser._id).then(function(data) {
						var _ref;
						if (data.isFollower === true) {
							$scope.membershipStatus = 'requested';
						}
						if (_ref = $scope.loggedUser._id, __indexOf.call($scope.communityMembers.map(function(member) {
							return member.userId;
						}), _ref) >= 0) {
							return $scope.membershipStatus = 'member';
						}
					});
					return;
				}
				return CommunityService.queryApplicants($routeParams.id).then(function(data) {
					return $scope.communityApplicants = data.filter(function(applicant) {
						var _ref;
						if (_ref = applicant.userId, __indexOf.call($scope.communityMembers.map(function(member) {
							return member.userId;
						}), _ref) < 0) {
							return applicant;
						}
					});
				});
			});
		};
		$scope.fetchPosts = function() {
			var searchParams;
			searchParams = {
				communityId: $routeParams.id,
				limit: $scope.limit,
				offset: $scope.offset
			};
			return CommunityService.queryPosts(searchParams).then(function(data) {
				$scope.posts = [];
				return data.forEach(function(item) {
					return $scope.posts.push(item);
				});
			}, function(err) {
				return console.log(err);
			});
		};
		$scope.fetchRatings = function() {
			var searchParams;
			searchParams = {
				communityId: $routeParams.id,
				limit: $scope.limit,
				offset: $scope.offset
			};
			return CommunityService.queryRatings(searchParams).then(function(data) {
				return $scope.ratings = data;
			}, function(err) {
				return console.log(err);
			});
		};
		$scope.$on('search', function() {
			$scope.profilePageType = $scope.routeParams.action || 'ads';
			if ($scope.profilePageType === 'ads') {
				$scope.fetchPosts();
			}
			if ($scope.profilePageType === 'feedback') {
				return $scope.fetchRatings();
			}
		});
		$scope.loadMore = function() {
			if ($scope.lastQueryReturnedCount > 0) {
				$scope.offset = $scope.offset + $scope.limit;
				return $scope.$broadcast('search');
			}
		};
		$scope.$watch('location.search().id', function(newval) {
			if (newval === undefined || newval === null) {
				return $scope.expandAd(null);
			} else {
				return $scope.posts.forEach(function(item) {
					if (item._id === newval) {
						return $scope.expandAd(item);
					}
				});
			}
		});
		$scope.showRatingDialog = function(score) {
			$scope.$broadcast('cancelReplyingAd');
			$scope.rating.errors = {};
			$scope.rating.data = {
				id: $scope.community._id,
				score: score
			};
			if ($scope.community._id != null) {
				$scope.rating.dialogShown = true;
			}
			if (score > 0) {
				return $scope.feedbackPlaceholder = $translate('POSITIVE_FEEDBACK_PLACEHOLDER');
			} else {
				return $scope.feedbackPlaceholder = $translate('NEGATIVE_FEEDBACK_PLACEHOLDER');
			}
		};
		$scope.saveRating = function() {
			if ($scope.rating.data.text.length < 3) {
				$scope.rating.errors = {
					text: 'ERR_RATING_TEXT_MIN_LEN'
				};
				return false;
			}
			delete $scope.rating.errors;
			return CommunityService.addRating($scope.rating.data).then(function(data) {
				var event, value;
				flash.success = 'RATING_WAS_SAVED';
				$scope.rating.dialogShown = false;
				if ($scope.rating.data.score > 0) {
					event = 'send thumb up';
					value = 25;
				} else {
					event = 'send thumb down';
					value = null;
				}
				$analytics.eventTrack(event, {
					category: 'Community profile',
					label: 'thanks',
					value: value
				});
				return init();
			}, function(res) {
				return Errors.process(res, $scope.rating);
			});
		};
		$scope.startProfileEdit = function() {
			$scope.editingCommunity = true;
			$scope.editCommunity = angular.copy($scope.community);
			if ($scope.editCommunity.terms) {
				return $scope.editCommunity.termsShown = true;
			}
		};
		$scope.cancelProfileEdit = function() {
			$scope.editingCommunity = false;
			return $scope.editCommunity = null;
		};
		$scope.updateCommunity = function($event) {
			var _ref, _ref1;
			if ((_ref = $scope.$$childHead) != null ? (_ref1 = _ref.updateCommunityForm) != null ? _ref1.$valid : void 0 : void 0) {
				return CommunityService.update($scope.editCommunity).then(function(data) {
					flash.success = $translate('COMMUNITY_UPDATED_DONE');
					return $window.location.reload();
				}, function(err) {
					return $scope.errorsUpdateCommunity = new ResponseErrors(err);
				});
			}
		};
		$scope.avatarUploadStarted = function() {
			return $scope.avatarUpload = true;
		};
		$scope.avatarUploadSucceeded = function(event) {
			$scope.avatar = angular.fromJson(event.target.responseText);
			$scope.editCommunity.avatar = $scope.avatar;
			return $scope.avatarUpload = false;
		};
		$scope.avatarUploadFailed = function() {
			$scope.avatarUpload = false;
			return flash.error = 'AVATAR_UPLOAD_FAILED';
		};
		$scope.follow = function(communityId, unfollow) {
			var promise, _ref;
			if (communityId === ((_ref = $scope.loggedCommunity) != null ? _ref._id : void 0)) {
				return;
			}
			promise = null;
			if (unfollow) {
				promise = CommunityService.removeApplicant(communityId, $scope.loggedUser._id);
			} else {
				promise = CommunityService.addApplicant(communityId);
			}
			return promise.then(function() {
				return init();
			});
		};
		$scope.acceptMembership = function(userId) {
			return UsersService.addFollower(userId).then(function(data) {
				return init();
			});
		};
		$scope.rejectMembership = function(userId) {
			return CommunityService.removeApplicant($scope.community._id, userId).then(function(data) {
				return init();
			});
		};
		$scope.removeMember = function(userId) {
			if (confirm($translate('COMMUNITY_MEMBER_REMOVE_ARE_YOU_SURE'))) {
				return CommunityService.removeMember($scope.community._id, userId).then(function(data) {
					return init();
				});
			}
		};
		$scope.$on('removePost', function(event, postId) {
			return $scope.posts.forEach(function(value, index) {
				if (value._id === postId) {
					return $scope.posts.splice(index, 1);
				}
			});
		});
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
		init = function() {
			$scope.communityMembers = $scope.communityApplicants = [];
			$scope.community = $scope.profile = $scope.editCommunity = $scope.rating = {};
			$scope.posts = $scope.ratings = [];
			$scope.membershipStatus = null;
			$scope.communityAdmin = {};
			$scope.fetchProfile();
			$scope.limit = 15;
			$scope.offset = 0;
			$scope.lastQueryReturnedCount = 0;
			return $scope.$broadcast('search');
		};
		return init();
	}
]).controller('CommunityRegisterCtrl', [
	'$scope', '$window', 'CommunityService', 'ResponseErrors', '$location', '$timeout', 'ipCookie',
	function($scope, $window, CommunityService, ResponseErrors, $location, $timeout, ipCookie) {
		$scope.community = {};
		return $scope.createCommunity = function($event) {
			if (!$scope.createCommunityForm.$invalid) {
				return CommunityService.add($scope.community).then(function(data) {
					ipCookie('newCommunityCreated', true);
					return $timeout(function() {
						return $window.location.reload();
					});
				}, function(err) {
					return $scope.errors = new ResponseErrors(err);
				});
			}
		};
	}
]).controller('CommunityListCtrl', [
	'$scope', 'CommunityService', 'FulltextService', 'UsersCommunitiesService',
	function($scope, CommunityService, FulltextService, UsersCommunitiesService) {
		$scope.query = null;
		$scope.view = null;
		$scope.fetchCommunities = function() {
			var searchParams, service;
			searchParams = {
				offset: $scope.offset,
				limit: $scope.limit,
				type: "community"
			};
			service = CommunityService;
			if ($scope.query) {
				service = FulltextService;
				searchParams.query = $scope.query;
			}
			if ($scope.isView('my')) {
				service = UsersCommunitiesService;
				searchParams.userId = $scope.loggedUser._id;
			}
			return service.query(searchParams).then(function(data) {
				$scope.lastQueryReturnedCount = data.length;
				return data.forEach(function(item) {
					if ($scope.isView('my')) {
						item = item.userId;
					}
					return $scope.items.push(item);
				});
			});
		};
		$scope.$on('search', function() {
			return $scope.fetchCommunities();
		});
		$scope.loadMoreAds = function() {
			if ($scope.lastQueryReturnedCount > 0 && !$scope.isView('my')) {
				$scope.offset = $scope.offset + $scope.limit;
				return $scope.$broadcast('search');
			}
		};
		$scope.refreshView = function(view) {
			var _ref;
			$scope.lastQueryReturnedCount = 0;
			$scope.offset = 0;
			$scope.limit = 15;
			$scope.items = [];
			if ((_ref = $scope.view) === 'all' || _ref === 'my') {
				return $scope.$broadcast('search');
			}
		};
		$scope.setView = function(view) {
			$scope.view = view;
			return $scope.refreshView();
		};
		$scope.isView = function(view) {
			return view === $scope.view;
		};
		$scope.init = function() {
			if (!$scope.view) {
				return $scope.setView('all');
			} else {
				return $scope.refreshView();
			}
		};
		return $scope.init();
	}
]);