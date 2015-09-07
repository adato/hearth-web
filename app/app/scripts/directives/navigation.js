 'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.conversationAdd
 * @description
 * @restrict A
 */
angular.module('hearth.directives').directive('navigation', [
    '$rootScope', 'Auth', '$state',
    function($rootScope, Auth, $state) {
        return {
            restrict: 'E',
            scope: false,
            replace: true,
            templateUrl: 'templates/navigation.html',
            link: function($scope, element) {
            	$scope.messagesCounters = $rootScope.messagesCounters;

		        $scope.reloadToMarketplace = function() {
	    	        if($state.current.name == 'market')
		                $state.reload();
		            else
		                $state.go('market');
		        };


		        /**
		         * When clicked on logout button
		         */
		        $scope.logout = function() {
		            Auth.logout(function() {
		                $rootScope.refreshToPath($$config.basePath);
		            });
		        };

		        setTimeout(function() {
	            	$(document).foundation();
	            	$(element).find('.top-bar a.menuItem').click(function() {
	            		if($('.top-bar').hasClass('expanded')) {
		            		$('.top-bar .toggle-topbar').click();
	            		}
	            	})
		        });
            }

        };
    }
]);