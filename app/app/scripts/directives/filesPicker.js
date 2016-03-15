'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.filesPicker
 * @description Allows to pick files for upload
 * @restrict A
 */

angular.module('hearth.directives').directive('filesPicker', [function() {

	return {
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

			var imageFileTypes = ['image/png', 'image/jpeg', 'image/gif'];
			ctrl.isImage = function(file) {
				return (imageFileTypes.indexOf(file.type) > -1);
			};

			ctrl.removeFile = function(index) {
				ctrl.scope.ngModel.splice(index, 1);
			};

		}],
		controllerAs: 'filesPicker'
	}

}])