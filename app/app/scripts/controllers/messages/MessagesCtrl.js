'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MessagesCtrl
 * @description List of messages
 */

angular.module('hearth.controllers').controller('MessagesCtrl', [
	'$scope', '$rootScope', 'Messages', 'UnauthReload', '$timeout', 'Notify',
	function($scope, $rootScope, Messages, UnauthReload, $timeout, Notify) {
		$scope.messages = false;
		$scope.detail = false;
		$scope.reply = {
			text: ''
		};
		
		$scope.showConversation = function(id) {
			$scope.detail = false;
			$scope.loadConversationDetail(id);
		};

		$scope.loadConversations = function(conf, done) {

			$timeout(function() {
				$scope.messages = [
					{_id: 1, recipients: ['Pepa Novák'], text: 'Ema má mísu..'},
					{_id: 2, recipients: ['Ludmila Nováková', 'Radek Doutnal'], text: 'Mama mele maso'},
					{_id: 3, recipients: ['Louskoták'], subject: 'Zahradní potřeby', text: 'Táta sbírá listí'},
				];

				done && done($scope.messages);
			}, 500);
			// Messages.get(conf, function(res) {
			// 	$scope.messages = res;
			// });
		};
		
		$scope.loadConversationDetail = function(id) {
			$scope.detail = false;

			$timeout(function() {

				$scope.detail = {
					 recipients: ['Ludmila Nováková', 'Radek Doutnal'],
					 messages: [
					 	{author: "Ludmila Nováková", text: "Cum sociis natoque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis. Proin sodales pulvinar tempor. Cum sociis natoque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. "},
					 	{author: "Aleš Cvrk Nováková", text: "Cum sociis natoque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. "},
					 	{author: "Lenka Kropenatá", text: "Iscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis. Proin sodales pulvinar tempor. Cum sociis natoque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. "},
					 ]
				};

				$scope.replyForm = {
					show: false
				};
				$scope.showError = {
					text: false
				};
				$scope.reply = {
					text: ''
				};
				
			}, 200);

			// Messages.getConversation({_id: id}, function(res) {
			// 	$scope.detail = res;
			// 	$scope.replyForm.show = false;
			// });
		};
		
		$scope.validateReply = function(reply) {
			var invalid = false;

			if(!reply.text || reply.text.length < 5)
				invalid = $scope.showError.text = true;
			
			return !invalid;
		};

		$scope.sendReply = function(reply) {
			reply._id = $scope.detail._id;

			console.log(reply);
			if(!$scope.validateReply(reply))
				return false;

			if($scope.sendingReply)
				return false;
			$scope.sendingReply = true;

			Messages.reply(reply, function(res) {

				$scope.sendingReply = false;
				Notify.addSingleTranslate('NOTIFY.MESSAGE_REPLY_SUCCESS', Notify.T_SUCCESS);
			}, function(err) {
				$scope.sendingReply = false;
				Notify.addSingleTranslate('NOTIFY.MESSAGE_REPLY_FAILED', Notify.T_ERROR);
			});
		};

		function init() {
			$scope.loadConversations({}, function(list) {
				list.length && $scope.loadConversationDetail(list[0]._id);
			});
		};

		UnauthReload.check();
		$scope.$on('initFinished', init);
		$rootScope.initFinished && init();
	}
]);