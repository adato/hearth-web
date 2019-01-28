'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.AddCommunityMembersCtrl
 * @description
 */

angular.module('hearth.controllers').controller('AddCommunityMembersCtrl', [
	'$scope', '$window', '$timeout',
	function($scope, $window, $timeout) {
        var ctrl = this;
        ctrl.info = {};
        ctrl.communityLink = null;

        if ($scope.ngDialogData && $scope.ngDialogData.community) {
            ctrl.info = $scope.ngDialogData.community;
            ctrl.communityLink = $window.$$config.appUrl + 'community/' + ctrl.info._id;
            
            $timeout(() => selectAllText(), 500);
        }

        function selectAllText() {
            var el = $window.document.getElementById('modal-community-link');
            if (el && el.focus && el.select) {
                el.focus();
                el.select();
            }
        }

        ctrl.copyLink = () => {
            selectAllText();
            $window.document.execCommand("copy");
        }
    }
]);