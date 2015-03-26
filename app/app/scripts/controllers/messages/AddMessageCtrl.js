'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.AddMessageCtrl
 * @description Controller for creating new message
 */

angular.module('hearth.controllers').controller('AddMessageCtrl', [
	'$scope', 'Messages', 'Notify',
	function($scope, Messages, Notify) {

		$scope.addMessage = function(msg) {
    		if($scope.sendMessage) return false;
			$scope.sendMessage = true;

			Messages.add(msg, function(res) {

        		$scope.sendMessage = false;
				Notify.addSingleTranslate('NOTIFY.MESSAGE_SEND_SUCCESS', Notify.T_SUCCESS);
        	}, function() {
        		$scope.sendMessage = false;
				Notify.addSingleTranslate('NOTIFY.MESSAGE_SEND_FAILED', Notify.T_ERROR);
			}, function(err) {

			});
		};
	}
]);