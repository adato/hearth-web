'use strict';

angular.module('hearth.directives').directive('avatar', [

	function() {
		var sizes = {
			small: 30,
			normal: 50,
			follow: 60,
			'user-search': 80,
			'large': 90
		};

		return {
			restrict: 'E',
			replace: true,
			scope: {
				'relation': '=',
				'source': '=',
				'clickFn': '&click',
				'type': '='
			},
			templateUrl: 'templates/avatar.html',
			link: function(scope, el, attrs) {
				scope.$watch('relation', function(val) {
					scope.extraClass = val;
					return scope.extraClass;
				});
				scope.$watch('type', function(val) {
					scope.defaultImageType = val === 'Community' ? EMPTY_COMMUNITY_AVATAR_URL : EMPTY_AVATAR_URL;

					return scope.defaultImageType;
				});
				scope.$watch('source', function(val) {
					scope.image = {
						name: 'normal',
						src: scope.defaultImageType
					};
					if (attrs['class']) {
						scope.image.className = attrs['class'];
					}
					scope.image.px = sizes[attrs.size];
					if (val && val[scope.image.name]) {
						var src = val[scope.image.name],
							uncachedSrc = val[scope.image.name] + '?' + (new Date()).getTime();

						scope.image.src = uncachedSrc;
						$('img[src^="' + src + '"]').prop('src', uncachedSrc);
					}
				});
			}
		};
	}
]);