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

	// this.cropSquareCenter = function(img, size, done) {
	// 	var oh = 0,
	// 		ow = 0;
	// 	var squareSize = Math.min(size.width, size.height);
	//
	// 	if (size.width > size.height) {
	// 		ow = Math.round((size.width - squareSize) / 2);
	//
	// 	} else if (size.width < size.height) {
	// 		oh = Math.round((size.height - squareSize) / 2);
	// 	}
	//
	// 	var canvas = document.createElement('canvas');
	// 	canvas.width = squareSize;
	// 	canvas.height = squareSize;
	// 	var ctx = canvas.getContext("2d");
	// 	ctx.drawImage(img, ow, oh, squareSize, squareSize, 0, 0, squareSize, squareSize);
	// 	return done(canvas.toDataURL("image/jpeg"));
	// };

	this.cropSmart = function(img, size, done) {
		var squareSize = Math.min(size.width, size.height);

		SmartCrop.crop(img, {
			width: squareSize,
			height: squareSize
		}, function(result) {
			var canvas = document.createElement('canvas');
			canvas.width = squareSize;
			canvas.height = squareSize;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, result.topCrop.x, result.topCrop.y, result.topCrop.width, result.topCrop.height, 0, 0, result.topCrop.width, result.topCrop.height);
			done(canvas.toDataURL("image/jpeg"));
		});
	};

	this.upload = function(fileBase64, uploadResource, fileItself, done, doneErr) {
		uploadResource(fileItself).$promise.then(function(res) {
			done(res);
		}, doneErr);
	};

}]);