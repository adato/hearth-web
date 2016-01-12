'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.fileUpload
 * @description 
 * @restrict A
 */

angular.module('hearth.directives').directive('fileUpload', [
	'$timeout', '$parse', '$rootScope',
	function($timeout, $parse, $rootScope) {
		return {
			transclude: true,
			replace: true,
			scope: true,
			template:  '<div>'
					 +  '<span ng-transclude style="position:relative"></span>'
					 +  '<input class="file-upload-input" type="file" id="{{ uploadElementName }}" name="{{ uploadElementName }}" accept="image/*">'
					 + '</div>',
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
						var errorUpload, file, formData, progressUpload, successUpload, xhr;
						file = event.target.files[0];
						if (!file) {
							return;
						}
						scope.errors = [];
						if (!/^image\//.test(file.type)) {
							scope.errors.push('ERR_WRONG_IMAGE_TYPE');
						}
						if (file.size > 1024 * 1024 * 10) {
							scope.errors.push('ERR_WRONG_IMAGE_SIZE');
						}
						if (scope.errors.length) {
							$rootScope.$broadcast('fileUploadError', {
								errors: scope.errors
							});
							return;
						}
						scope.progress = 0;
						scope.uploaded = false;
						formData = new FormData();
						formData.append(scope.uploadElementName, file);
						xhr = new XMLHttpRequest();
						progressUpload = function(val) {
							var progress;
							progress = (val.loaded / val.total) * 100;
							return scope.$apply(function() {
								$rootScope.$broadcast('fileUploadProgress', {
									percent: progress
								});
								return scope.progress = progress;
							});
						};
						successUpload = function(xhrEvent) {
							return scope.$apply(function() {
								$rootScope.$broadcast('fileUploadFinished', {});
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
							$rootScope.$broadcast('fileUploadError', {
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
					});
				});
			}
		};
	}
]);