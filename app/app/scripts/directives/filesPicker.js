'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.filesPicker
 * @description Allows to pick files for upload
 * @restrict E
 */

angular.module('hearth.directives').directive('filesPicker', ['FileService', '$timeout', function(FileService, $timeout) {

	return {
		restrict: 'E',
		replace: true,
		scope: {
			ngModel: '=',
			// if filesPattern evaluates to a string that matches a property
			// of FileService.fileTypes, this property is then trasnformed to an
			// input accept attribute
			filesPattern: '=',
			filesMultiple: '='
		},
		templateUrl: 'templates/directives/filesPicker.html',
		controller: ['$scope', function($scope) {

			var ctrl = this;

			ctrl.scope = $scope;
			ctrl.scope.previews = [];
			if (!($scope.ngModel instanceof Array)) $scope.ngModel = [];
			ctrl.scope.invalidFileType = FileService.getCleanInvalidFileType();
			ctrl.multiple = $scope.filesMultiple;
			ctrl.pattern = (FileService.fileTypes[$scope.filesPattern] !== void 0 ? FileService.fileTypes[$scope.filesPattern].join(',') : '');

			ctrl.isImage = function(file) {
				if (file) return (FileService.fileTypes.image.indexOf(file.type) > -1);
			};

			ctrl.removeFile = function(index) {
				ctrl.scope.ngModel.splice(index, 1);
				ctrl.scope.previews.splice(index, 1);
			};

		}],
		controllerAs: 'filesPicker',
		link: function(scope, element) {
			function pushAttachment(file) {
				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function(e) {
					if (!(scope.ngModel instanceof Array)) scope.ngModel = [];

					// check that i'm not uploading files with forbidden extensions
					var fileExtension = file.name.split('.');
					fileExtension = fileExtension[fileExtension.length - 1];
					if (FileService.fileTypes.forbidden.indexOf('.' + fileExtension) > -1) {
						// let user know that the file type is invalid
						scope.invalidFileType.shown = true;
						scope.invalidFileType.type = fileExtension;
						// clear the input
						element.value = '';
						if (!scope.$$phase) scope.$apply();
						return false;
					}

					// clean possible invalid file type notification
					scope.invalidFileType.shown = false;
					scope.invalidFileType.type = null;

					// check that I'm not uploading duplicities
					for (var i = scope.ngModel.length; i--;) {
						if ((scope.ngModel[i].name === file.name) && (scope.ngModel[i].type === file.type) && (scope.ngModel[i].size === file.size) && (scope.ngModel[i].lastModified === file.lastModified)) return;
					}

					scope.ngModel.push(file);
					scope.previews.push(e.target.result);
					if (!scope.$$phase) scope.$apply();
				};
			}
			$timeout(function() {
				var input = element[0].querySelectorAll('[change-event-attacher]');
				if (input) {
					input[0].addEventListener('change', function(event) {
						for (var i = event.target.files.length; i--;) {
							pushAttachment(event.target.files[i]);
						}
						// clear the input
						event.target.value = '';
					});
				}
			});
		}
	};

}]);