'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.AdDetail
 * @description
 */

angular.module('hearth.controllers').controller('AdDetail', [
	'$scope', 'AdDetailResource', '$routeParams', 'PostsService', 'ResponseErrors', '$timeout', '$rootScope',

	function($scope, AdDetailResource, $routeParams, PostsService, ResponseErrors, $timeout, $rootScope) {
		$scope.item = {};
		$scope.replyDisplayed = false;
		$scope.reply = {};

		AdDetailResource.get({
			id: $routeParams.id
		}, function(data) {
			$scope.item = data;
			$scope.profile = data.author;
		});

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
				$scope.replyToAdSubmitted = false;
				$scope.replyDisplayed = false;
				$scope.reply = {
					id: undefined,
					message: '',
					agreed: false
				};
				return $timeout(function() {
					$scope.ad = null;
					return delete this.errors;
				}, 8000);
			}).then(null, function() {
				delete this.errors;
				$scope.replyToAdSubmitting = false;
				return $scope.replyToAdSubmitting;
			});
		};
	}

]);