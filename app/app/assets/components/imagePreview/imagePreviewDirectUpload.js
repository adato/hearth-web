'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.imagePreview
 * @description
 *		options:
 *			- minSize - limit in dimensions (in pixels) (square)
 *			- limitMb - limit in file size (in MB)
 *			- uploadingQueue - this property will be assigned an integer - how many more file are queued for upload, 0 if all is uploaded
 *			- error - object to which to write errors
 *					- badMinSize
 *					- badSizePx
 *					- uploadError
 *					- badFormat
 * @restrict A
 */
angular.module('hearth.directives').directive('imagePreviewDirectUpload', [
	'$log', 'PresignUploader',
	function($log, PresignUploader) {
		return {
			transclude: true,
			restrict: 'A',
			scope: {
				result: '=',
				options: '='
			},
			templateUrl: 'assets/components/imagePreview/imagePreviewDirectUpload.html',
			link: function(scope, el, attrs) {

				var IMAGE_TYPE = /image.*/;
				scope.allowedTypes = ['JPG', 'JPEG', 'PNG', 'GIF'];
				var o = scope.options;

				scope.showErrors = true;
				o.error = o.error || {};
				scope.uploadingQueue = 0;

				scope.result = scope.result || (scope.multiple ? [] : {});

				// if we want to show errors outside of directive
				if (angular.isUndefined(o.error)) scope.showErrors = false;

				/////////////////////////
				/////////////////////////
				/// BINDINGS

				el.bind('change', function(event) {
					previewImage(el, o.limitMb);
				});

				/////////////////////////
				/////////////////////////
				/// FUNCTIONS

				function handleImageLoad(img, imgFile, limitSize, fileItself) {

					if (img.width < o.minSize || img.height < o.minSize) {
						return o.error.badSizePx = true;
					}

					if (img.width <= $$config.imgMaxPixelSize && img.height <= $$config.imgMaxPixelSize && imgFile.total > (limitSize * 1024 * 1024)) {
						return o.error.badMinSize = true;
					}

					scope.uploadingQueue++;

					PresignUploader.upload({
						file: fileItself
					}).then(function(res) {
						scope.uploadingQueue--;

						var result = {
							file: fileItself
						};
						result[o.resultPropName || 'url'] = res.url;

						if (o.multiple) {
							scope.result.push(result);
						} else {
							scope.result = result;
						}

						$('input', el).val('');
					}, function(err) {
						scope.uploadingQueue--;
						o.error.uploadError = true;
						$log.error('Error: ', err);
						$('input', el).val('');
					});
				}

				function previewImage(el, limitSize) {
					var files = $(".file-upload-input", el)[0].files;

					cleanErrors();

					angular.forEach(files, function(file) {
						if (isInvalidFile(file)) return false;

						var reader = new FileReader();
						reader.onload = function(e) {
							var imgFile = e.target.result;

							if (!isInvalidFormat(file, imgFile)) {
								// this will check image size
								var image = new Image();
								image.src = imgFile;
								return image.onload = function() {
									handleImageLoad(this, e, limitSize, file);
								};
							}
						};
						reader.readAsDataURL(file);
					});
				}

				function isInvalidFile(file) {
					var device = detectDevice();
					if (!file)
						return true;

					if (!device.android) {
						// Since android doesn't handle file types right, do not do this check for phones
						if (!file || !file.type) {
							$log.error("File does not have type attribute", file);
							return true;
						}

						if (!file.type.match(IMAGE_TYPE)) {
							return o.error.badFormat = true;
						}
					}

					return false;
				}

				function isInvalidFormat(file, imgFile) {
					var format = imgFile.split(';')[0].split('/')[1].toUpperCase();
					var device = detectDevice();

					// We will change this for an android
					if (device.android) {
						format = file.name.split('.');
						format = format[format.length - 1].toUpperCase();
					}

					if (!~scope.allowedTypes.indexOf(format)) {
						// bad format
						return o.error.badFormat = true;
					}

					return false;
				}

				// Detect client's device
				function detectDevice() {
					var ua = navigator.userAgent;
					var brand = {
						apple: ua.match(/(iPhone|iPod|iPad)/),
						blackberry: ua.match(/BlackBerry/),
						android: ua.match(/Android/),
						microsoft: ua.match(/Windows Phone/),
						zune: ua.match(/ZuneWP7/)
					}
					return brand;
				}

				function cleanErrors() {
					Object.keys(o.error).forEach(function(key) {
						delete o.error[key];
					});
				}

			}
		};
	}
]);