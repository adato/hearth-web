'use strict';

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
			link: function(scope, el, attrs) {
				var init;
				init = function() {
					var _ref;
					scope.status = {
						visible: false,
						sentOk: false,
						sentError: false,
						sending: false
					};
					scope.invitation = {
						toEmail: null,
						userId: (_ref = scope.loggedUser) != null ? _ref._id : void 0
					};
					return scope.sendInvitationForm.$setPristine(true);
				};
				scope.$watch('visible', function(newval, oldval) {
					if (newval !== oldval && (newval != null)) {
						return scope.status.visible = newval;
					}
				});
				scope.$watch('status.visible', function(newval, oldval) {
					if (newval !== oldval && (newval != null)) {
						return scope.visible = newval;
					}
				});
				scope.sendInvitation = function() {
					if (!scope.sendInvitationForm.$valid) {
						return;
					}
					scope.status.sending = true;
					return Invitation.add(scope.invitation, function(data) {
						scope.status.sentOk = true;
						return $timeout(function() {
							return init();
						}, 3000);
					}, function(err) {
						return scope.status.sentError = new ResponseErrors(err);
					});
				};
				scope.cancel = init;
				return init();
			}
		};
	}
]);