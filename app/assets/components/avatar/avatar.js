'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.avatar
 * @description component that creates an avatar (user or community)
 * @opts
 *		src - url to avatar
 *		size - css class - see avatar.scss
 *		type - community or user
 *		href - if present, the avatar will be a link with its value as its href, div otherwise
 *		dynamic - if present, the template will not be one time bound
 * @restrict E
 */
angular.module('hearth.directives').directive('avatar', [function() {

	return {
		restrict: 'E',
		replace: true,
		scope: {
			'src': '=',
			'size': '@',
			'type': '=',
			'href': '='
		},
		templateUrl: (el, attrs) => {
			const template = attrs.dynamic !== void 0 ? 'avatar-dynamic' : 'avatar'
			return `assets/components/avatar/${template}.html`
		},
		link: function($scope) {
			$scope.class = "avatar-" + ($scope.size || 'normal') + ' ' + (($scope.type === 'Community') ? 'avatar-community' : 'avatar-user')
		}
	}

}])