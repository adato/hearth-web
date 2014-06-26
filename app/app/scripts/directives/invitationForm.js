'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.invitationForm
 * @description
 * @restrict AE
 */

angular.module('hearth.directives').directive('invitationForm', [
	'Invitation', '$timeout', 'ResponseErrors',
	function(Invitation, $timeout, ResponseErrors) {
		return {
			restrict: 'AE',
			replace: true,
			scope: {
				'visible': '=',
				'loggedUser': '='
			},
			templateUrl: 'templates/invitationForm.html',
			link: function(scope) {
				var init;
				init = function() {
					var loggedUser = scope.loggedUser;
					scope.status = {
						visible: false,
						sentOk: false,
						sentError: false,
						sending: false
					};
					scope.invitation = {
						toEmail: null,
						user_id: loggedUser ? loggedUser._id : void 0
					};
					return scope.sendInvitationForm.$setPristine(true);
				};
				scope.$watch('visible', function(newval, oldval) {
					if (newval !== oldval && (newval != null)) {
						scope.status.visible = newval;
						return scope.status.visible;
					}
				});
				scope.$watch('status.visible', function(newval, oldval) {
					if (newval !== oldval && (newval != null)) {
						scope.visible = newval;
						return scope.visible;
					}
				});
				scope.sendInvitation = function() {
					if (scope.sendInvitationForm.$valid) {
						var data = scope.invitation;

						scope.status.sending = true;
						data.toEmail = scope.invitation.toEmail.replace(/\s/g, '').split(','); //remove all space and split

						return Invitation.add(data, function() {
							scope.status.sentOk = true;
							return $timeout(function() {
								return init();
							}, 3000);
						}, function(err) {
							scope.status.sentError = new ResponseErrors(err);
							return scope.status.sentError;
						});
					}
				};
				scope.cancel = init;
				return init();
			}
		};
	}
]);