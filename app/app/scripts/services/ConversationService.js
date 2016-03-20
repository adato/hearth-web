'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ConversationService
 * @description Factory for conversations
 */

angular.module('hearth.services').factory('ConversationService', ['FileService', function(FileService) {

	var factory = {};

	factory.getCleanInvalidFileType = function() {
		return {
			shown: false,
			type: null
		};
	};

	factory.onFileUpload = function($scope, element, scopeProperty) {
		var fileExtension = element.files[0].name.split('.');
		fileExtension = fileExtension[fileExtension.length - 1];

		if (FileService.fileTypes.forbidden.indexOf(fileExtension) > -1) {
			$scope.invalidFileType.shown = true;
			$scope.invalidFileType.type = fileExtension;
			element.value = '';
			return false;
		}
		$scope.invalidFileType.shown = false;
		$scope.invalidFileType.type = null;

		$scope[scopeProperty].attachments_attributes = element.files[0];
		element.value = '';
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
	};

	return factory;

}]);