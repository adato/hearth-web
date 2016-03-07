'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.communityCreateEdit
 * @description 
 * @restrict E
 */
angular.module('hearth.directives').directive('communityCreateEdit', [
	'$rootScope', '$location', '$stateParams', 'Community', 'CommunityMembers', 'CommunityDelegateAdmin', 'Notify', 'Auth',
	function($rootScope, $location, $stateParams, Community, CommunityMembers, CommunityDelegateAdmin, Notify, Auth) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				hideHeading: '=',
				close: "&"
			},
			templateUrl: 'templates/directives/communityEditForm.html',
			link: function($scope, element) {
				$scope.communityMembers = false;
				$scope.loaded = false;
				$scope.adminChangeId = null;
				$scope.errorLoading = false;
				$scope.sendingDelete = false;
				$scope.sendingDelegation = false;
				$scope.defaultCommunity = {
					name: '',
					locations: [],
					description: '',
					terms: '',
				};
				$scope.showError = {
					name: false,
					locations: false,
					description: false,
					social_networks: [],
				};

				$scope.socialNetworks = {
					'twitter': {
						'url': 'twitter.com\/.*'
					},
					'facebook': {
						'url': 'facebook.com\/.*'
					},
					'linkedin': {
						'url': 'linkedin.com\/.*'
					},
					'googleplus': {
						'url': 'plus.google.com\/.*'
					}
				};

				$scope.community = {};

				$scope.confirmBox = $rootScope.confirmBox;

				$scope.fillDefaultCommunity = function() {

					$scope.community = angular.copy($scope.defaultCommunity);
					$scope.loaded = true;
				};

				/**
				 * Function will remove user from list
				 * @param  {string} id UserId to remove
				 * @param  {array} arr User list in array
				 * @return {array}     User list without me
				 */
				$scope.removeMemberFromList = function(arr, uId) {

					for (var i = 0; i < arr.length; i++) {
						if (arr[i]._id == uId) {
							arr.splice(i, 1);
							break;
						}
					}
					return arr;
				};

				$scope.checkOwnership = function(community) {

					return $scope.community.admin === $rootScope.loggedUser._id;
				};

				$scope.loadCommunity = function(id, callback) {
					Community.get({
						_id: id
					}, function(res) {
						$scope.community = res;
						if ($scope.checkOwnership($scope.community)) {
							$scope.loaded = true;
							if (callback !== undefined) callback();
						} else {
							$location.path('/community/' + $scope.community._id);
						}
					}, function(err) {
						$scope.errorLoading = err.status;
					});

					CommunityMembers.query({
						communityId: id
					}, function(res) {
						// remove myself from list
						$scope.communityMembers = $scope.removeMemberFromList(res, $rootScope.loggedUser._id);
						if ($scope.communityMembers.length) {
							$scope.adminChangeId = $scope.communityMembers[0]._id;
						}
					});
				};

				$scope.getCommunityId = function() {
					return $stateParams.id;
				};

				$scope.prepareDataIn = function() {
					if (!$scope.community.webs || !$scope.community.webs.length) {
						$scope.community.webs = [''];
					}
				}

				$scope.prepareDataOut = function(data) {
					var webs = [];
					data.webs.forEach(function(web) {
						if (web) webs.push(web);
					});
					data.webs = webs;
					return data;
				}

				$scope.updateUrl = function($event, model, key) {
					var input = $($event.target),
						url = input.val();

					if (url && !url.match(/http[s]?:\/\/.*/)) {
						url = 'https://' + url;
					}

					if (model !== $scope.community.webs) {
						// editing social network, not webs
						if (url && ($scope.socialNetworks[key] === undefined || !url.match(new RegExp($scope.socialNetworks[key].url)))) {
							$scope.showError.social_networks[key] = true;
						} else {
							$scope.showError.social_networks[key] = false;
						}
					}

					model[key] = url;
				};


				$scope.validateSocialNetworks = function() {
					var isOk = true;
					Object.keys($scope.socialNetworks).forEach(function(networkName) {
						if ($scope.community[networkName] && !$scope.community[networkName].match($scope.socialNetworks[networkName].url)) {
							$scope.showError.social_networks[networkName] = true;
							isOk = false;
						}
					});
					return isOk;
				};

				$scope.validate = function(data) {
					var err = false;

					if ($scope.communityForm.name.$invalid) {
						$scope.showError.name = err = true;
					}

					if ($scope.communityForm.description.$invalid) {
						$scope.showError.description = err = true;
					}

					if (!$scope.validateSocialNetworks()) {
						err = true;
					}

					return !err; // return true if valid
				};

				$scope.save = function() {
					// if we have community ID - then edit
					var service = ($scope.community._id) ? Community.edit : Community.add;
					// validate data
					if (!$scope.validate($scope.community)) {
						$rootScope.scrollToError();
						return false;
					}

					// lock
					if ($scope.sending) return false;
					$scope.sending = true;
					$rootScope.globalLoading = true;

					service($scope.prepareDataOut($scope.community), function(res) {
						$rootScope.globalLoading = false;
						$rootScope.$broadcast("reloadCommunities");
						$location.path('/community/' + res._id);

						if ($scope.community._id)
							Notify.addSingleTranslate('NOTIFY.COMMUNITY_UPDATE_SUCCESS', Notify.T_SUCCESS);
						else
							Notify.addSingleTranslate('NOTIFY.COMMUNITY_CREATE_SUCCESS', Notify.T_SUCCESS);

					}, function(res) {
						$scope.sending = false;
						$rootScope.globalLoading = false;
					});
				};

				$scope.change = function(id, needReload) {

					if (!id || $scope.sendingDelegation) return false;
					$scope.sendingDelegation = true;

					$rootScope.globalLoading = true;
					CommunityDelegateAdmin.delegate({
							community_id: $scope.community._id,
							new_admin_id: id
						},
						function(res) {
							$rootScope.globalLoading = false;
							$scope.sendingDelegation = false;

							if (needReload) {

								Notify.addTranslateAfterRefresh('NOTIFY.COMMUNITY_DELEGATE_ADMIN_SUCCESS', Notify.T_SUCCESS);
							} else {

								$rootScope.$broadcast("reloadCommunities");
								Notify.addSingleTranslate('NOTIFY.COMMUNITY_DELEGATE_ADMIN_SUCCESS', Notify.T_SUCCESS);
							}

							$scope.reloadToPath('/community/' + $scope.community._id, needReload);

						},
						function(res) {
							$scope.sendingDelegation = false;
							$rootScope.globalLoading = false;
						});
				};

				$scope.reloadToPath = function(path, hard) {

					if (hard) {
						$rootScope.refreshToPath(path);
					} else {

						$rootScope.$broadcast("reloadCommunities");
						$location.path(path);
					}
				};

				$scope.delete = function(needReload) {

					if ($scope.sendingDelete) return false;
					$scope.sendingDelete = true;
					$rootScope.globalLoading = true;

					Community.remove({
						_id: $scope.community._id
					}, function(res) {
						$rootScope.globalLoading = false;
						$scope.sendingDelete = false;

						if (!needReload) {

							Notify.addSingleTranslate('NOTIFY.COMMUNITY_DELETE_SUCCESS', Notify.T_SUCCESS);
							$rootScope.$broadcast("reloadCommunities");
						} else {

							Notify.addTranslateAfterRefresh('NOTIFY.COMMUNITY_DELETE_SUCCESS', Notify.T_SUCCESS);
						}

						$scope.reloadToPath('/communities', needReload);

					}, function(res) {
						$rootScope.globalLoading = false;
						$scope.sendingDelete = false;
					});
				};

				$scope.close2 = function() {
					$scope.close();
				};

				$scope.init = function() {
					$scope.pluralCat = $rootScope.pluralCat;

					if ($scope.getCommunityId()) {
						$scope.loadCommunity($scope.getCommunityId(), $scope.prepareDataIn);
					} else {
						$scope.fillDefaultCommunity();
					}
				};

				$scope.changeSelectValue = function(val) {
					$scope.adminChangeId = val;
				};

				$scope.$on('initFinished', $scope.init);
				$rootScope.initFinished && $scope.init();
			}
		};
	}
]);