'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.imagePreview
 * @description
 * @restrict A
 */

angular.module('hearth.directives').directive('imagePreview', [
	'$timeout', '$parse', '$rootScope', 'ImageLib', '$log',
	function($timeout, $parse, $rootScope, ImageLib, $log) {
		return {
			transclude: true,
			replace: true,
			scope: {
				files: '=?',
				uploadResource: '=?',
				fileSizes: '=?',
				limit: '=',
				uploadingNotifier: '&',
				error: '=?',
				getImageSizes: '&',
				limitPixelSize: '=',
				singleFile: '=',
			},
			template: '<div class="image-preview-container"><div class="image-preview image-upload" ng-class="{uploading: uploading}">' + '<input class="file-upload-input" multiple file-model="picFile" type="file"' + ' name="file" ' + 'accept="image/*">' + '<div class="file-upload-overlay"></div>' + '<span ng-transclude class="image-preview-content"></span>' + '</div>' + '<div ng-if="showErrors && error.badFormat" class="error animate-show">{{ "ERROR_BAD_IMAGE_FORMAT" | translate:"{formats: \'"+allowedTypes.join(", ")+"\'}" }}</div>' + '<div ng-if="showErrors && error.badSize" class="error animate-show">{{ "ERROR_BAD_IMAGE_SIZE" | translate:"{maxSize: "+limit+"}" }}</div>' + '<div ng-if="showErrors && error.badSizePx" class="error animate-show">{{ "ERROR_BAD_IMAGE_SIZE_PX" | translate:"{minSize: "+limitPixelSize+"}" }}</div>' + '<div ng-if="showErrors && error.uploadError" class="error animate-show">{{ "ERROR_WHILE_UPLOADING" | translate:"{minSize: "+limitPixelSize+"}" }}</div>' + '</div>',
			link: function(scope, el, attrs) {
				scope.allowedTypes = ['JPG', 'JPEG', 'PNG', 'GIF'];
				scope.showErrors = true;
				scope.error = scope.error || {};
				scope.uploading = 0;

				// preview jen jednoho souboru? Nebo to budeme davat do pole
				if (scope.singleFile) {
					scope.files = scope.files || {};
				} else {
					scope.files = scope.files || [];
				}

				// if we want to show errors outside of directive
				if (angular.isUndefined(scope.error))
					scope.showErrors = false;

				function isInvalidFile(file) {
					var device = detectDevice();
					var imageType = /image.*/;
					if (!file)
						return true;

					if (!device.android) {
						// Since android doesn't handle file types right, do not do this check for phones
						if (!file || !file.type) {
							$log.error("File does not have type attribute", file);
							return true;
						}

						if (!file.type.match(imageType)) {
							return scope.error.badFormat = true;
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
						return scope.error.badFormat = true;
					}

					return false;
				}

				/**
				 *	Pushes data into the scope.files object, which should be the controller model
				 */
				function pushResult(data, img) {
					if (scope.singleFile) {
						scope.files = data;
					} else {
						scope.files.push(data);
						scope.fileSizes.push(img.total);
					}
				}

				function handleImageLoad(img, imgFile, limitSize, fileItself) {
					var resized;

					if (img.width < scope.limitPixelSize || img.height < scope.limitPixelSize)
						return scope.error.badSizePx = true;

					// if there is not upload resource, upload images later
					if (!scope.uploadResource) return pushResult({
						file: imgFile.target.result,
						toBeUploaded: fileItself
					}, {
						total: 0
					});

					if (img.width <= $$config.imgMaxPixelSize && img.height <= $$config.imgMaxPixelSize &&
						imgFile.total > (limitSize * 1024 * 1024)
					) {
						return scope.error.badSize = true;
					}

					scope.uploading++;
					scope.$apply();
					$timeout(function() {

						resized = ImageLib.resize(img, ImageLib.getProportionalSize(img, $$config.imgMaxPixelSize, $$config.imgMaxPixelSize));
						resized = ExifRestorer.restore(imgFile.target.result, resized);
						ImageLib.upload(resized.split(',').pop(), scope.uploadResource, fileItself, function(res) {
							scope.uploading--;
							pushResult(res, {
								total: 0
							});
							$('input', el).val('');
						}, function(err) {
							scope.uploading--;
							scope.error.uploadError = true;
							$log.error('Error: ', err);
							$('input', el).val("");
						});
					}, 50);
				}

				function previewImage(el, limitSize) {
					var files = $(".file-upload-input", el)[0].files;
					scope.error = {};

					angular.forEach(files, function(file) {
						if (isInvalidFile(file)) {
							return false;
						}

						var reader = new FileReader();
						reader.onload = function(e) {
							var imgFile = e.target.result;

							if (!isInvalidFormat(file, imgFile)) {
								// this will check image size
								var image = new Image();
								image.src = imgFile;
								return image.onload = function() {
									handleImageLoad(this, e, limitSize, file);
									scope.$apply();
								};
							}
							scope.$apply();
						};
						reader.readAsDataURL(file);
					});
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

				scope.$watch("uploading", function(val) {
					if (scope.uploadingNotifier)
						scope.uploadingNotifier({
							val: val
						});
				});

				return el.bind('change', function(event) {
					previewImage(el, scope.limit); // 5 mb limit
					if (!scope.$$phase && !$rootScope.$$phase) scope.$apply();
				});
			}
		};
	}
]);