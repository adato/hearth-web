'use strict';

angular.module('hearth.directives').directive('identitySwitch', [
	'UsersService', 'Auth', '$window', '$location', '$timeout',
	function(UsersService, Auth, $window, $location, $timeout) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				loggedUser: '=',
				loggedCommunity: '=',
				switchFn: '&'
			},
			templateUrl: 'templates/identitySwitch.html',
			link: function(scope, el, attrs) {
				var init;
				scope.myCommunities = [];
				scope.switchTo = function(account) {
					var accountId;
					accountId = account.id || account._id;
					return Auth.switchIdentity(accountId).then(function() {
						$location.path('/community/' + accountId);
						return $timeout(function() {
							return $window.location.reload();
						});
					});
				};
				scope.switchBack = function() {
					return Auth.switchIdentityBack().then(function() {
						$location.path('/profile/' + scope.loggedUser._id);
						return $timeout(function() {
							return $window.location.reload();
						});
					});
				};
				scope.clickAvatar = function() {
					var _ref, _ref1, _ref2;
					if ((_ref = scope.myCommunities) != null ? _ref.length : void 0) {
						return scope.switchExpanded = !scope.switchExpanded;
					} else {
						if (!((_ref1 = scope.loggedCommunity) != null ? _ref1._id : void 0)) {
							$location.path('/profile/' + scope.loggedUser._id);
						}
						if ((_ref2 = scope.loggedCommunity) != null ? _ref2._id : void 0) {
							return $location.path('/community/' + scope.loggedCommunity._id);
						}
					}
				};
				scope.$watch('loggedUser', function(newval, oldval) {
					if (newval !== oldval && (newval !== null && newval !== (void 0))) {
						return init();
					}
				});
				scope.$watch('loggedCommunity', function(newval, oldval) {
					if (newval !== oldval && (newval !== null && newval !== (void 0))) {
						return init();
					}
				});
				init = function() {
					var _ref;
					scope.loggedEntity = scope.loggedCommunity || scope.loggedUser;
					if (((_ref = scope.loggedUser) != null ? _ref._id : void 0) != null) {
						return UsersService.queryCommunities(scope.loggedUser._id).then(function(data) {
							scope.myCommunities = [];
							return data.forEach(function(item) {
								if ((item.admin != null) && item.admin === scope.loggedUser._id) {
									return scope.myCommunities.push({
										name: item.userFullname,
										id: item.userId._id,
										avatar: item.userAvatar
									});
								}
							});
						});
					}
				};
				return init();
			}
		};
	}
]);