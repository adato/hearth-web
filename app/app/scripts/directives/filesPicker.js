'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.filesPicker
 * @description Allows to pick files for upload
 * @restrict E
 */

angular.module('hearth.directives').directive('filesPicker', ['FileService', function(FileService) {

	return {
		restrict: 'E',
		scope: {
			ngModel: '=',
			filesPattern: '=',
			filesMultiple: '='
		},
		templateUrl: 'templates/directives/filesPicker.html',
		controller: ['$scope', function($scope) {

			var ctrl = this;

			ctrl.scope = $scope;
			ctrl.pattern = $scope.filesPattern;
			ctrl.multiple = $scope.filesMultiple;

			ctrl.isImage = function(file) {
				return (FileService.fileTypes.image.indexOf(file.type) > -1);
			};

			$scope.uploadedFile = function(element) {
				console.log(element);
			}

			ctrl.removeFile = function(index) {
				ctrl.scope.ngModel.splice(index, 1);
			};

		}],
		controllerAs: 'filesPicker'
	}

}]);