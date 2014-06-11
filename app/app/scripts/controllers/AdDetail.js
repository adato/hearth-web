'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.AdDetail
 * @description
 */

angular.module('hearth.controllers').controller('AdDetail', [
	'$scope', 'AdDetailResource', '$routeParams', 'PostsService', 'ResponseErrors', '$rootScope', 'UsersService',

	function($scope, AdDetailResource, $routeParams, PostsService, ResponseErrors, $rootScope, UsersService) {
		$scope.ad = {};
		$scope.replyDisplayed = false;
		$scope.reply = {};
		$scope.isMine = false;
		$scope.hideCloseButton = true;

		AdDetailResource.get({
			id: $routeParams.id
		}, function(data) {
			data.profileUrl = data.author._type === 'Community' ? 'community' : 'profile';
			$scope.ad = data;
			$scope.profile = data.author;
			$scope.isMine = data.author._id === $scope.loggedUser._id;
			$scope.agreeTranslationData = {
				name: data.author.name
			};
		});

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
			return promise;
		};

		$scope.replyToAd = function(ad) {
			$scope.reply = {
				id: ad._id,
				message: $scope.reply.message,
				agreed: $scope.reply.agreed
			};
			if (!$scope.reply.message || $scope.reply.message.length < 3) {
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
			return PostsService.reply($scope.reply).then(function() {
				$scope.replyToAdSubmitting = false;
				$scope.replyToAdSubmitted = true;
				$scope.replyDisplayed = false;
				$scope.reply = {
					id: undefined,
					message: '',
					agreed: false
				};

			}).then(null, function() {
				delete this.errors;
				$scope.replyToAdSubmitting = false;
			});
		};
	}

]);