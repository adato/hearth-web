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
			template: '\
      <div ng-show="status.visible && loggedUser._id">\
        <div ng-show="!status.sentOk" class="invitation-form">\
            <form name="sendInvitationForm" id="sendInvitationForm" ng-submit="sendInvitation()">\
                <h4 translate>HEARTH_INVITATION</h4>\
                <p translate>HEARTH_INVITATION_TEXT</p>\
                <div style="position:relative;">\
                    <div class="alert-box alert error round connect-bottom" ng-show="status.sentError">{{ status.sentError.base | translate }}</div>\
                    <button type="submit" class="primary button prefix round connect-left" ng-disabled="status.sending"\
                            analytics-on analytics-event="sending invitation" analytics-category="Invitations"\
                            ><i class="icon-envelope"></i></button>\
                    <input type="email" class="text-input round connect-right" ng-model="invitation.toEmail" style="width:85%;" required>\
                </div>\
                <a href="" ng-click="cancel()" translate>CANCEL</a>\
            </form>\
        </div>\
        <div ng-show="status.sentOk" class="clearfix padding-2 padding-v-4 successfully-sent">\
              {{ \'INVITATION_SENDING_SUCCESS\' | translate }}\
        </div>\
      </div>',
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