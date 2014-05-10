'use strict';

angular.module('hearth.directives').directive('fileUploadOutput', [
	'$rootScope',
	function($rootScope) {
		return {
			scope: true,
			replace: true,
			template: '<div>' + '<ul ng-if="!progress && errors.length"><li ng-repeat="error in errors"><small class="alert-box alert error round">{{ error | translate}}</small></li></ul>' + '<div class="progress " ng-show="progress"><span class="meter" style="width: {{ progress }}%;"></span></div>' + '</div>',
			link: function(scope, el, attrs) {
				var init;
				init = function() {
					scope.progress = 0;
					return scope.errors = [];
				};
				$rootScope.$on('fileUploadProgress', function($event, val) {
					if (val.percent != null) {
						return scope.progress = val.percent;
					}
				});
				$rootScope.$on('fileUploadError', function($event, val) {
					return scope.errors = val.errors;
				});
				$rootScope.$on('fileUploadFinished', function($event, val) {
					return init();
				});
				return init();
			}
		};
	}
]);