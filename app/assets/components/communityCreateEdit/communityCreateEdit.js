'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.communityCreateEdit
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('communityCreateEdit', [
	'$rootScope', '$location', '$stateParams', 'Community', 'CommunityMembers', 'CommunityDelegateAdmin', 'Notify', 'Auth', 'Validators', 'ProfileUtils', 'KeywordsService', '$timeout', '$q', 'ngDialog', 
	function($rootScope, $location, $stateParams, Community, CommunityMembers, CommunityDelegateAdmin, Notify, Auth, Validators, ProfileUtils, KeywordsService, $timeout, $q, ngDialog) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				hideHeading: '=',
				close: "&"
			},
			templateUrl: 'assets/components/communityCreateEdit/communityEditForm.html',
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
					is_public: true,
					is_private: false
				};
				$scope.parameters = ProfileUtils.params;
				$scope.showError = {
					name: false,
					locations: false,
					description: false,
					social_networks: [],
					terms: false,
				};

				$scope.avatarUploadOpts = ProfileUtils.getUploadOpts();
				$scope.avatarUploadOpts.uploadingQueue = $scope.imageUploading;
				$scope.avatarUploadOpts.error = $scope.showError.avatar;

				$scope.community = {}; 		// this is the actual model
				$scope.editCommunity = {}; 	// this is the copy of edited data (when editing, not creating new)

				$scope.confirmBox = $rootScope.confirmBox;

				$scope.fillDefaultCommunity = function() {
					$scope.community = angular.copy($scope.defaultCommunity);
					$scope.loaded = true;
				};

				$scope.queryKeywords = function($query) {
					return KeywordsService.queryKeywords($query);
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

				$scope.loadCommunity = function(id) {
					Community.get({
						_id: id
					}, function(data) {
						$scope.community = prepareDataIn(data);
						
						if (!data.locations || !data.locations.length || data.locations[0] === void 0) {
							data.locations = [];
						}

						$scope.editCommunity = angular.copy($scope.community);

						if ($scope.checkOwnership($scope.community)) {
							$scope.loaded = true;
						} else {
							$location.path('/community/' + $scope.community._id);
						}
					}, function(err) {
						$scope.errorLoading = err.status;
					});

					CommunityMembers.query({
						communityId: id
					}, function(data) {
						// remove myself from list
						$scope.communityMembers = $scope.removeMemberFromList(data, $rootScope.loggedUser._id);
						if ($scope.communityMembers.length) {
							$scope.adminChangeId = $scope.communityMembers[0]._id;
						}
					});
				};

				function prepareDataIn(data) {
					return ProfileUtils.transformDataForUsage({
						type: ProfileUtils.params.PROFILE_TYPES.COMMUNITY,
						profile: data
					});
				};

				function prepareWebs(data) {
					var webs = [];
					data.webs.forEach(function(web) {
						if (web) webs.push(web);
					});
					return webs;
				}

				var prepareDataOut = function(data) {
					var data = angular.copy(data);
					if (data.webs !== undefined) data.webs = prepareWebs(data);
					ProfileUtils.single.joinInterests(data);

					// avatar
					if (data.avatar && data.avatar.public_avatar_url) {
						data.public_avatar_url = data.avatar.public_avatar_url;
					}
					delete data.avatar;

					return data;
				};

				$scope.updateUrl = function($event, model, key) {
					var input = $($event.target),
						url = input.val();

					if (url && !url.match(/http[s]?:\/\/.*/)) {
						url = 'http://' + url;
					}

					if (model !== $scope.community.webs) {
						// editing social network, not webs
						$scope.showError.social_networks[key] = !Validators.social(url, key);
					} else {
						// editing webs
						$scope.showError.social_networks['webs'] = !Validators.url(url);
					}

					model[key] = url;
				};

				$scope.validateSocialNetworks = function() {
					var isOk = true;
					var isWebsOk = true;
					var isLinkOk = true;
					['facebook', 'twitter', 'linkedin'].forEach(function(networkName) {
						if ($scope.community[networkName]) {
							isLinkOk = Validators.social($scope.community[networkName], networkName);
							$scope.showError.social_networks[networkName] = !isLinkOk;
							isOk = isOk && isLinkOk;
						}
					});
					isWebsOk = Validators.urls($scope.community.webs);
					$scope.showError.social_networks['webs'] = !isWebsOk;

					return isOk && isWebsOk;
				};

				$scope.validate = function(data) {
					var err = false;

					if ($scope.communityForm.name.$invalid) {
						$scope.showError.name = err = true;
					}
					if (data.is_private && $scope.communityForm.communityTermsAgreement.$error.required) {
						$scope.showError.terms = err = true;
					}

					if (!$scope.validateSocialNetworks()) {
						err = true;
					}

					return !err; // return true if valid
				};

				$scope.save = function() {
					var data = $scope.community;

					// validate data
					if (!$scope.validate(data)) {
						$rootScope.scrollToError();
						return false;
					}

					// lock
					if ($scope.sending) {
						return false;
					};


					var saveFn = function (data) {
						$scope.sending = true;
						$rootScope.globalLoading = true;
	
						var actions = {
							community: Community[(data._id ? 'edit' : 'add')](prepareDataOut($scope.community)).$promise
						};
	
						$q.all(actions).then(function(res) {
							res = res.community;
							$rootScope.globalLoading = false;
							$rootScope.$emit('reloadCommunities');
							$location.path('/community/' + res._id);
							Notify.addSingleTranslate('COMMUNITY.NOTIFY.SUCCESS_' + ($scope.community._id ? 'UPDATE' : 'CREATE'), Notify.T_SUCCESS);
						}, function(res) {
							$scope.sending = false;
							$rootScope.globalLoading = false;
						});
					} 

					// if there is a change of privacy (private vs public group) show alert box
					if ($scope.editCommunity._id && (data.is_private != $scope.editCommunity.is_private 
						 || data.is_public != $scope.editCommunity.is_public)) {
						ngDialog.openConfirm({
							templateUrl:  'assets/modals/communityChangePrivacyType.html',
							showClose: false
						}).then(function (result) {
							result === true && saveFn(data);
						}, function (err) {});
					} else {
						// normal situation
						// (privacy has not changed)
						saveFn(data);
					}


				};

				$scope.change = function(id, needReload) {
					if (!id || $scope.sendingDelegation) {
						return false;
					}
					$scope.sendingDelegation = true;
					$rootScope.globalLoading = true;

					CommunityDelegateAdmin.delegate({
							community_id: $scope.community._id,
							new_admin_id: id
						},
						function(res) {
							$rootScope.globalLoading = false;
							$scope.sendingDelegation = false;

							var msg = 'COMMUNITY.NOTIFY.SUCCESS_DELEGATE_ADMIN';
							if (needReload) {
								Notify.addTranslateAfterRefresh(msg, Notify.T_SUCCESS);
							} else {
								$rootScope.$emit('reloadCommunities');
								Notify.addSingleTranslate(msg, Notify.T_SUCCESS);
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
						$rootScope.$emit('reloadCommunities');
						$location.path(path);
					}
				};

				$scope.delete = function(needReload) {
					if ($scope.sendingDelete) {
						return false
					};

					$scope.sendingDelete = true;
					$rootScope.globalLoading = true;

					Community.remove({
						_id: $scope.community._id
					}, function(res) {
						$rootScope.globalLoading = false;
						$scope.sendingDelete = false;
						var msg = 'COMMUNITY.NOTIFY.SUCCESS_DELETE_COMMUNITY';

						if (!needReload) {
							Notify.addSingleTranslate(msg, Notify.T_SUCCESS);
							$rootScope.$emit('reloadCommunities');
						} else {
							Notify.addTranslateAfterRefresh(msg, Notify.T_SUCCESS);
						}

						$scope.reloadToPath('/communities', needReload);
					}, function(res) {
						$rootScope.globalLoading = false;
						$scope.sendingDelete = false;
					});
				};

				$scope.getCommunityId = function() {
					return $stateParams.id;
				};

				$scope.close2 = function() {
					$scope.close();
				};

				$scope.saveCommunityConversationSettings = function() {
					// kamil:
					// value is taken from $scope and in timeout, because on-change handler on checkbox directive
					// is broken somehow and passes values before the toggle change..
					// or maybe I just don't understand how it's supposed to work..
					$timeout(function() {
						Community.patch({
							_id: $scope.community._id,
							allow_message_to_members: $scope.community.allow_message_to_members
						}, function(res) {
							Notify.addSingleTranslate('COMMUNITY.NOTIFY.SUCCESS_' + ($scope.community._id ? 'UPDATE' : 'CREATE'), Notify.T_SUCCESS);
						});
					});
				};

				$scope.init = function() {
					$scope.pluralCat = $rootScope.pluralCat;

					if ($scope.getCommunityId()) {
						$scope.loadCommunity($scope.getCommunityId(), prepareDataIn);
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