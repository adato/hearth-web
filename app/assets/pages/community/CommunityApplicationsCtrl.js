'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityApplicationsCtrl', [
	'$scope', '$rootScope', 'CommunityApplicants', '$stateParams',
	function($scope, $rootScope, CommunityApplicants, $stateParams) {
        var ctrl = this;
        ctrl.applicants = [];
        
        var conf = {
            communityId: $stateParams['id'],
            limit: 5,
            offset: 0
        };

        ctrl.fetch = () => {
            CommunityApplicants.query(conf).$promise.then(function(data) {
                if (data.length) {
                    ctrl.applicants = data;
                } else {
                    ctrl.applicants = [];
                }
            });
        };

        $rootScope.$on('communityApplicationApproved', () => { ctrl.fetch() });
        $rootScope.$on('communityApplicationRejected', () => { ctrl.fetch() });
        ctrl.fetch();

    }
]);