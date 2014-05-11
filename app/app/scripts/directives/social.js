'use strict';

/**
 * @ngdoc directive
 * @name social
 * @description Displays social networks links
 * @restrict E
 */
angular.module('hearth.directives').directive('social', [

	function() {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			scope: {
				id: '='
			},
			templateUrl: 'templates/social.html',
			link: function(scope, el) {
				var url = window.location.href + '?id=' + scope.id;
				angular.extend(scope, {
					facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
					gplus: 'https://plus.google.com/share?url=' + url,
					twitter: 'https://twitter.com/share?url=' + url,
					linkedin: 'http://www.linkedin.com/shareArticle?mini=true&url=' + url
				});
			}

		};
	}
]);