'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileEditCtrl
 * @description controller for profile editation form page
 */

angular.module('hearth.controllers').controller('ProfileEditCtrl', [
	'$scope', 'User', '$location', '$rootScope', '$timeout', 'Notify', 'UnauthReload', 'Auth', 'Validators', 'ProfileUtils', 'Interest', '$q', 'LanguageList', '$translate',
	function($scope, User, $location, $rootScope, $timeout, Notify, UnauthReload, Auth, Validators, ProfileUtils, Interest, $q, LanguageList, $translate) {

		$scope.loaded = false
		$scope.sending = false
		$scope.profile = {}
		$scope.showError = {
			locations: false,
			first_name: false,
			motto: false,
			email: false,
			phone: false,
			contact_email: false,
			message: false,
			social_networks: [],
			avatar: {}
		}
		$scope.avatarUploadOpts = ProfileUtils.getUploadOpts()
		$scope.avatarUploadOpts.uploadingQueue = $scope.imageUploading
		$scope.avatarUploadOpts.error = $scope.showError.avatar

		$scope.parameters = ProfileUtils.params

		/* languages supported in "languages-i-speak" section */
		$scope.languageList = LanguageList.localizedList
		/* Array that will be filled with user's languages */
		$scope.userLanguage = []


		$scope.loadLanguages = function(query) {
			var languages = $scope.languageList;

			return languages.filter(function(lang) {
				return lang.name.toLowerCase().indexOf(query.toLowerCase()) != -1;
			});
		};

		$scope.init = function() {

			UnauthReload.check();

			User.getFullInfo(function(res) {
				$scope.profile = transformDataIn(res);
				$scope.loaded = true;
			}, function(res) {});
		};

		function transformDataIn(data) {

			data = ProfileUtils.transformDataForUsage({
				type: ProfileUtils.params.PROFILE_TYPES.USER,
				profile: data
			});

			if (typeof data.user_languages != 'undefined' && data.user_languages.length) {
				data.user_languages.forEach(function(userLang) {
					$scope.userLanguage.push({
						'code': userLang,
						'name': $translate.instant('MY_LANG.' + userLang)
					});
				});
			}

			$scope.showContactMail = data.contact_email && data.contact_email != '';
			return data;
		};

		$scope.avatarUploadFailed = function(err) {
			$scope.uploadingInProgress = false;
		};

		$scope.avatarUploadStarted = function(argument) {
			$scope.uploadingInProgress = true;
		};

		$scope.avatarUploadSucceeded = function(event) {
			$scope.profile.avatar = angular.fromJson(event.target.responseText);
			$scope.uploadingInProgress = false;
		};

		$scope.updateUrl = function($event, model, key) {
			var input = $($event.target),
				url = input.val();

			if (url && !url.match(/http[s]?:\/\/.*/)) {
				url = 'http://' + url;
			}

			if (model !== $scope.profile.webs) {
				// editing social network, not webs
				$scope.showError.social_networks[key] = !Validators.social(url, key);
			} else {
				// editing webs
				$scope.showError.social_networks['webs'] = !Validators.url(url);
			}

			model[key] = url;
		};

		$scope.validatePhone = function(event) {
			$scope.showError.phone = true;
			var phone = event.target;

			if (!$scope.profile.phone && !$scope.profileEditForm.phone.$error.internationalPhoneNumber) {
				$(phone).val(null);
			}
		};

		$scope.validateSocialNetworks = function() {
			var isOk = true;
			var isWebsOk = true;
			var isLinkOk = true;
			['facebook', 'twitter', 'linkedin', 'googleplus'].forEach(function(networkName) {
				if ($scope.profile[networkName]) {
					isLinkOk = Validators.social($scope.profile[networkName], networkName);
					$scope.showError.social_networks[networkName] = !isLinkOk;
					isOk = isOk && isLinkOk;
				}
			});
			isWebsOk = !!Validators.urls($scope.profile.webs);
			$scope.showError.social_networks['webs'] = !isWebsOk;

			return isOk && isWebsOk;
		};

		$scope.switchLanguage = function(lang) {
			$scope.profile.user_languages[lang] = !$scope.profile.user_languages[lang];
		};

		$scope.disableErrorMsg = function(key) {
			$scope.showError[key] = false;
		};

		function interestsFilter(query) {
			return function(interest) {
				return interest.toLowerCase().indexOf(query.toLowerCase()) != -1;
			}
		}

		var interests = [];
		$scope.loadInterests = function(query) {
			return $q(function(resolve, reject) {
				Interest.query({
					name: query
				}, function(res) {
					interests = res.map(function(interest) {
						return interest.term;
					});
					resolve(interests.filter(interestsFilter(query)));
				});
			});
		};

		$scope.transferDataOut = function(data) {
			var webs = [];
			var interests = [];

			// remove empty webs
			data.webs.forEach(function(web) {
				if (web) webs.push(web);
			});
			data.webs = webs;

			if (data.phone) {
				data.phone = '+' + data.phone;
			}

			if (!data.interests) {
				data.interests = [];
			} else {
				for (var i = data.interests.length; i--;) {
					data.interests[i] = data.interests[i].term;
				}
			}

			data.user_languages = [];
			$scope.userLanguage.forEach(function(userLang) {
				data.user_languages.push(userLang.code);
			});

			// avatar
			if (data.avatar && data.avatar.public_avatar_url) {
				data.public_avatar_url = data.avatar.public_avatar_url;
			}
			delete data.avatar;

			return data;
		};

		$scope.validateData = function(data) {
			var res = true;

			if ($scope.profileEditForm.first_name.$invalid) {
				res = false;
				$scope.showError.first_name = true;
			}

			if ($scope.profileEditForm.email.$invalid) {
				res = false;
				$scope.showError.email = true;
			}

			if ($scope.profileEditForm.phone.$invalid) {
				res = false;
				$scope.showError.phone = true;
			}

			if (typeof $scope.userLanguage !== 'undefined' && $scope.userLanguage.length == 0) {
				res = false;
				$scope.showError.user_language = true;
			}


			if (!$scope.validateSocialNetworks()) {
				res = false;
			}

			if ($scope.profileEditForm.about.$invalid || $scope.profileEditForm.interests.$invalid) {
				res = false;
			}

			return res;
		};

		$scope.update = function() {
			var transformedData;

			if (!$scope.validateData($scope.profile)) {
				Notify.addSingleTranslate('NOTIFY.USER_PROFILE_FORM_HAS_ERRORS', Notify.T_ERROR);
				$rootScope.scrollToError();
				return false;
			}

			if ($scope.sending) return false;
			$scope.sending = true;
			$rootScope.globalLoading = true;

			transformedData = $scope.transferDataOut(angular.copy($scope.profile));
			var actions = {
				user: User.edit(transformedData).$promise
			};

			$q.all(actions).then(function(res) {
				$scope.sending = false;
				$rootScope.globalLoading = false;

				// refresh user info - for example avatar in navbar
				Auth.refreshUserInfo();
				$location.path('/profile/' + $scope.profile._id);
				Notify.addSingleTranslate('NOTIFY.USER_PROFILE_CHANGE_SUCCES', Notify.T_SUCCESS);

			}, function(res) {
				var data = res.data;
				var errors = data.errors;

				if (data && errors) {
					if (errors.contact_email) {
						Notify.addSingleTranslate('NOTIFY.USER_PROFILE_CONTACT_EMAIL_ERROR', Notify.T_ERROR);
						$scope.showError.contact_email = true;
						$scope.profileEditForm.contact_email.$setValidity('email_used', false);
						$rootScope.scrollToError();
					} else {
						Notify.addSingleTranslate('NOTIFY.USER_PROFILE_CHANGE_FAILED', Notify.T_ERROR);
					}
				}

				$rootScope.globalLoading = false;
				$scope.sending = false;
			});
		};

		// when blur event on input - wait with displaying errors - if we clicked also on remove contcat email
		// remove him instead
		$scope.contactEmailBlur = function() {
			$timeout(function() {
				$scope.showError.contact_email = true;
			});
		};

		$scope.contactEmailFocus = function() {
			$scope.showError.contact_email = false;
		};


		$scope.hideContactEmail = function() {
			// hide input & set him empty and dont show any errors
			$scope.showContactMail = false;

			$timeout(function() {
				$scope.showError.contact_email = false;
			}, 100);
		};

		$scope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
		$scope.$watch('showError', function() {
			$scope.messageBottom = false;
		}, true);

	}
]);