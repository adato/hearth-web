'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.imagePreview
 * @description
 * @restrict A
 */

angular.module('hearth.directives').directive('imagePreview', [
	'$timeout', '$parse', '$rootScope',
	function($timeout, $parse, $rootScope) {
		return {
			transclude: true,
			replace: true,
			scope: {
				files: "=?",
				limit: "=",
				limitPixelSize: "=",
				singleFile: "=",
			},
			template: '<div class="image-preview-container"><div class="image-preview  image-upload">'
						+ '<input class="file-upload-input" type="file"' + ' name="file" ' + 'accept="image/*" capture>' 
						+ '<span ng-transclude class="image-preview-content"></span>' 
						+ '</div>'
	                    + '<div ng-if="error.badFormat" class="error animate-show">{{ "ERROR_BAD_IMAGE_FORMAT" | translate }}</div>'
	                    + '<div ng-if="error.badSize" class="error animate-show">{{ "ERROR_BAD_IMAGE_SIZE" | translate }}</div>'
	                    + '<div ng-if="error.badSizePx" class="error animate-show">{{ "ERROR_BAD_IMAGE_SIZE_PX_"+limitPixelSize | translate }}</div>'
						+'</div>',
			link: function(scope, el, attrs) {
				scope.allowedTypes = ['JPG', 'JPEG', 'PNG', 'GIF'];

				// preview jen jednoho souboru? Nebo to budeme davat do pole
				if(scope.singleFile) {
					scope.files = scope.files || {};
				} else {
					scope.files = scope.files || [];
				}

				function previewImage(el, limitSize) {
					var file = $(el).find(".file-upload-input")[0].files[0],
						imageType = /image.*/,
						device = detectDevice();
					
					scope.error = {};

					if (!device.android) { // Since android doesn't handle file types right, do not do this check for phones
						if (!file.type.match(imageType)) {
							return scope.error.badFormat = true;
						}
					}

					var reader = new FileReader();
					reader.onload = function(e) {
						var format = e.target.result.split(';')[0].split('/')[1].toUpperCase();

						// We will change this for an android
						if (device.android) {
							format = file.name.split('.');
							format = format[format.length - 1].toUpperCase();
						}

						// if the picture has right format and is its size is in limit
						if ((!!~ scope.allowedTypes.indexOf(format)) && e.total < (limitSize * 1024 * 1024)) {
							var src = e.target.result;

							// very nasty hack for android
							// This actually injects a small string with format into a temp image.
							if (device.android) {
								src = src.split(':');
								if (src[1].substr(0, 4) == 'base') {
									src = src[0] + ':image/' + format.toLowerCase() + ';' + src[1];
								}
							}
						}

						// neni spravny format
						if (!~scope.allowedTypes.indexOf(format)) {
							scope.error.badFormat = true;

						// neni spravna velikost
						} else if (e.total > (limitSize * 1024 * 1024)) {
							scope.error.badSize = true;
						} else {

							// this will check image size
							var image = new Image();
							image.src = e.target.result;

							image.onload = function() {

								if(this.width < scope.limitPixelSize || this.height < scope.limitPixelSize) {
									scope.error.badSizePx = true;
								} else {

									if(scope.singleFile) {
										scope.files = {file:src};
									} else {
										scope.files.push({file:src});
									}
								}
								scope.$apply();
							};
						}
						scope.$apply();
					};
					reader.readAsDataURL(file);
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

				return el.bind('change', function(event) {
					return scope.$apply(function() {
						previewImage(el, scope.limit); // 5 mb limit
					});
				});
			}
		};
	}
]);