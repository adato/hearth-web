'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.fileViewer
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('fileViewer', [
	'Conversations', '$window', 'Notify',
	function(Conversations, $window, Notify) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'templates/directives/fileViewer.html',
			scope: {
				message: "="
			},
			link: function(scope, element, attrs) {
				scope.download = function(message) {
					Conversations.downloadAttachment({
						messageId: message._id,
						fileId: message.file_attachments[0]._id
					}, function(res) {
						$window.location.href = res.url;
					}, function() {
						Notify.addSingleTranslate('NOTIFY.ATTACHMENT_DOWNLOAD_FAILED', Notify.T_ERROR);
					});
				};
			}
		};
	}
]);