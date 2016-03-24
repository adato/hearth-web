'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ConversationService
 * @description Factory for conversations
 */

angular.module('hearth.services').factory('ConversationService', ['FileService', function(FileService) {

	var factory = {};

	/**
	 *	Attaches an image from input[type='file'] to a scopeProperty of choosing
	 *	and if the file is an image, specifies this in {Bool} scope.fileIsImage
	 *
	 *	Only works for non-multiple file inputs
	 */
	factory.onFileUpload = function($scope, element, scopeProperty) {
		var fileExtension = element.files[0].name.split('.');
		fileExtension = fileExtension[fileExtension.length - 1];

		if (FileService.fileTypes.forbidden.indexOf('.' + fileExtension) > -1) {
			// let user know that the file type is invalid
			$scope.invalidFileType.shown = true;
			$scope.invalidFileType.type = fileExtension;
			// clear the input
			element.value = '';
			return false;
		}
		// clear invalid message
		$scope.invalidFileType.shown = false;
		$scope.invalidFileType.type = null;

		$scope[scopeProperty].attachments_attributes = element.files[0];
		if (FileService.fileTypes.image.indexOf($scope[scopeProperty].attachments_attributes.type) > -1) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$('#file-preview').attr('src', e.target.result);
			};
			reader.readAsDataURL(element.files[0]);
			$scope.fileIsImage = true;
		} else {
			$scope.fileIsImage = false;
		}
		// clear the input
		element.value = '';
	};

	return factory;

}]);