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
			templateUrl: 'assets/components/fileViewer/fileViewer.html',
			scope: {
				message: "="
			},
			link: function(scope, element, attrs) {
				scope.images = {};
				scope.imagesDefinition = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/bmp', 'image/webp']

				scope.displayImage = function (message, index) {
					Conversations.downloadAttachment({
						messageId: message._id,
						fileId: message.file_attachments[index]._id
					}, function(res) {
						scope.images[index] = res.url;
					});
				}

				scope.getSrc = function ($index) {
					return scope.images[$index] || null;
				}


				scope.download = function(message, index) {
					Conversations.downloadAttachment({
						messageId: message._id,
						fileId: message.file_attachments[index]._id
					}, function(res) {
						$window.location.href = res.url;
					}, function() {
						Notify.addSingleTranslate('COMMON.NOTIFY.ERROR_ATTACHMENT_DOWNLOAD_FAILED', Notify.T_ERROR);
					});
				};
			}
		};
	}
]);