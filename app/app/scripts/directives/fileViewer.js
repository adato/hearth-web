'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.fileViewer
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('fileViewer', [
	'Conversations',
	function(Conversations) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'templates/directives/fileViewer.html',
			scope: {
				message: "="
			},
			link: function(scope, element, attrs) {

				scope.download = function(message) {
					console.log(message);
					Conversations.downloadAttachment({
						messageId: message._id,
						fileId: message.file_attachments[0]._id
					}, function(res) {
						console.log(res);
					}, function(err) {
						console.log(err);
					});
				};
			}
		};
	}
]);