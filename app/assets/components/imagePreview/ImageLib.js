'use strict';

angular.module('hearth.directives').service('ImageLib', ['$http', '$window', function($http, $window) {

	this.getProportionalSize = function(img, maxWidth, maxHeight) {
		var ratio = 1;
		var width = img.width;
		var height = img.height;

		if (img.width > maxWidth || img.height > maxHeight) {
			var ratioX = (maxWidth / width);
			var ratioY = (maxHeight / height);
			var ratio = Math.min(ratioX, ratioY);
		}

		return {
			width: Math.floor(width * ratio),
			height: Math.floor(height * ratio)
		};
	};

	this.resize = function(img, newSize, outputCanvas) {
		var canvas = document.createElement('canvas');
		canvas.width = newSize.width;
		canvas.height = newSize.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, newSize.width, newSize.height);
		return outputCanvas ? canvas : canvas.toDataURL("image/jpeg");
	};

	this.upload = function(fileBase64, uploadResource, fileItself, done, doneErr) {
		uploadResource(fileItself).$promise.then(function(res) {
			done(res);
		}, doneErr);
	};

}]);