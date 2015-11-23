'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.fileUploadOutput
 * @description 
 * @restrict A
 */

angular.module('hearth.directives').directive('fileUploadOutput', [
	'$rootScope',
	function($rootScope) {
		return {
			scope: true,
			replace: true,
			template: '<div>' + '<ul ng-if="!progress && errors.length"><li ng-repeat="error in errors"><small class="alert-box alert error round">{{ error | translate}}</small></li></ul>' + '<div class="progress " ng-show="progress"><span class="meter" style="width: {{ progress }}%;"></span></div>' + '</div>',
			link: function(scope) {
				var init;
				init = function() {
					scope.progress = 0;
					scope.errors = [];
					return scope.errors;
				};
				$rootScope.$on('fileUploadProgress', function($event, val) {
					if (val.percent != null) {
						scope.progress = val.percent;
						return scope.progress;
					}
				});
				$rootScope.$on('fileUploadError', function($event, val) {
					scope.errors = val.errors;
					return scope.errors;
				});
				$rootScope.$on('fileUploadFinished', function() {
					return init();
				});
				return init();
			}
		};
	}
]);
