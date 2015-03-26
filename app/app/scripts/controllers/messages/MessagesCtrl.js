'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MessagesCtrl
 * @description List of messages
 */

angular.module('hearth.controllers').controller('MessagesCtrl', [
	'$scope', '$rootScope', 'Messages', 'UnauthReload',
	function($scope, $rootScope, Messages, UnauthReload) {
		$scope.messages = false;

		$scope.showConversation = function(id) {
			$scope.detail = false;
			$scope.loadConversationDetail(id);
		};


		$scope.loadConversations = function() {

			$timeout(function() {
				$scope.messages = [
					{_id: 1, recipients: ['Pepa Novák'], text: 'Ema má mísu..'},
					{_id: 2, recipients: ['Ludmila Nováková', 'Radek Doutnal'], text: 'Mama mele maso'},
					{_id: 3, recipients: ['Louskoták'], subject: 'Zahradní potřeby', text: 'Táta sbírá listí'},
				];

			}, 2000)
			// Messages.get({}, function(res) {
			// 	$scope.messages = res;
			// });
		};
		
		$scope.loadConversationDetail = function(id) {
			Messages.getDetail({_id: id}, function(res) {
				$scope.detail = res;
			});
		};
		
		function init() {
			$scope.loadConversations(function() {
				// if(scope.mesa)
			});
		};

		UnauthReload.check();
		$scope.$on('initFinished', init);
		$rootScope.initFinished && init();
	}
]);