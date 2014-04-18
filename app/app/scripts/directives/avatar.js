'use strict';

angular.module('hearth.directives').directive('avatar', [

	function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				'relation': '=',
				'source': '=',
				'clickFn': '&click',
				'type': '='
			},
			template: '<span ng-class="extraClass" ng-click="clickFn()" ><img ng-src="{{ image.src }}" height="{{ image.px }}" width="{{ image.px }}"></span>',
			link: function(scope, el, attrs) {
				scope.$watch('relation', function(val) {
					return scope.extraClass = val;
				});
				scope.$watch('type', function(val) {
					if (val === 'Community') {
						scope.defaultImageType = EMPTY_COMMUNITY_AVATAR_URL;
					}
					if (val === 'User' || val === null || val === undefined) {
						return scope.defaultImageType = EMPTY_AVATAR_URL;
					}
				});
				return scope.$watch('source', function(val) {
					scope.image = {
						name: 'normal',
						src: scope.defaultImageType
					};
					if ((attrs["class"] != null) && attrs['class']) {
						scope.image.className = attrs['class'];
					}
					if (attrs.size === 'small') {
						scope.image.px = 30;
					}
					if (attrs.size === 'normal') {
						scope.image.px = 50;
					}
					if (attrs.size === 'follow') {
						scope.image.px = 60;
					}
					if (attrs.size === 'user-search') {
						scope.image.px = 80;
					}
					if (attrs.size === 'large') {
						scope.image.px = 96;
					}
					if ((val != null) && (val[scope.image.name] != null) && val[scope.image.name]) {
						return scope.image.src = val[scope.image.name];
					}
				});
			}
		};
	}
]);