'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.AddCommunityMembersCtrl
 * @description
 */

angular.module('hearth.controllers').controller('AddCommunityMembersCtrl', [
	'$scope', '$window', '$timeout', '$http',
	function ($scope, $window, $timeout, $http) {
        var ctrl = this;
        ctrl.info = {};
        ctrl.communityLink = null;
        ctrl.showSuccessTick = false;

        if ($scope.ngDialogData && $scope.ngDialogData.community) {
            ctrl.info = $scope.ngDialogData.community;

            let communityLink = $window.$$config.appUrl + 'community/' + ctrl.info._id;

            if ($window.$$config.shortLinkGeneratorUrl && $window.$$config.shortLinkAccessUrl) {
                $http.get($window.$$config.shortLinkGeneratorUrl, { 
                    withCredentials: false,
                    params: { url: communityLink }
                }).then((response) => {
                    if (response.data && response.data.url) {
                        ctrl.communityLink = $window.$$config.shortLinkAccessUrl + response.data.url;
                    }
                }, (error) => {
                    ctrl.communityLink = communityLink;
                })
            } else {
                ctrl.communityLink = communityLink;
            }
            
            $timeout(() => selectAllText(), 500);
        }


    }
]);