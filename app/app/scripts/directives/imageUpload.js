'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.fileUpload
 * @description
 * @restrict A
 */

angular.module('hearth.directives').directive('imageUpload', [
	'$timeout', '$parse', '$rootScope',
	function($timeout, $parse, $rootScope) {
		return {
			restrict: 'A',
			transclude: true,
			replace: true,
			scope: true,
			template: '<div>' + '<span ng-transclude></span>' + '<input class="image-upload-input" type="file" multiple id="{{ uploadElementName }}" name="{{ uploadElementName }}" accept="image/*">' + '</div>',
			link: function(scope, el, attrs) {
				var invoker;
				scope.uploadName = attrs.uploadName;
				scope.$watch(scope.uploadName, function(newval) {
					if (newval != null) {
						return scope.uploadElementName = newval;
					}
				});
				if (attrs.onFileUploadSuccess) {
					invoker = $parse(attrs.onFileUploadSuccess);
				}
				return el.bind('change', function(event) {
					return scope.$apply(function() {
						var errorUpload, files, formData, progressUpload, successUpload, xhr;
						files = event.target.files;
						if (!files) {
							return;
						}
						scope.errors = [];

						//send each file as a separate request to lessen the
						//request total size and improve responsiveness
						for (var i = files.length; i--;) {
							if (!/^image\//.test(files[i].type)) {
								scope.errors.push('ERR_WRONG_IMAGE_TYPE');
							}
							if (files[i].size > 1024 * 1024 * 10) {
								scope.errors.push('ERR_WRONG_IMAGE_SIZE');
							}
							if (scope.errors.length) {
								$rootScope.$emit('fileUploadError', {
									errors: scope.errors
								});
								return;
							}
							scope.progress = 0;
							scope.uploaded = false;
							formData = new FormData();
							formData.append(scope.uploadElementName, files[i]);
							xhr = new XMLHttpRequest();
							progressUpload = function(val) {
								var progress;
								progress = (val.loaded / val.total) * 100;
								return scope.$apply(function() {
									$rootScope.$emit('fileUploadProgress', {
										percent: progress
									});
									return scope.progress = progress;
								});
							};
							successUpload = function(xhrEvent) {
								return scope.$apply(function() {
									$rootScope.$emit('fileUploadFinished', {});
									scope.progress = 0;
									scope.uploaded = true;
									if (attrs.onFileUploadSuccess) {
										return invoker(scope, {
											$event: xhrEvent
										});
									}
								});
							};
							errorUpload = function() {
								$rootScope.$emit('fileUploadError', {
									error: scope.errors
								});
								return scope.$apply(function() {
									scope.progress = 0;
									scope.uploaded = false;
									if (attrs.onFileUploadError) {
										return scope.$eval(attrs.onFileUploadError);
									}
								});
							};
							xhr.upload.addEventListener('progress', progressUpload, false);
							xhr.addEventListener('load', successUpload, false);
							xhr.addEventListener('error', errorUpload, false);
							xhr.addEventListener('abort', errorUpload, false);
							xhr.open('POST', $$config.apiPath + attrs.fileUploadPath);
							xhr.send(formData);
							if (attrs.onFileUploadStarted) {
								return scope.$eval(attrs.onFileUploadStarted);
							}
						}
					});
				});
			}
		};
	}
]);