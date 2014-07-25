'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.social
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
				item: '='
			},
			templateUrl: 'templates/directives/social.html',
			link: function(scope) {
				scope.$watch('item', function(value) {
					var url = window.location.href.replace(window.location.hash, '');
					if (value) {
						url += '%23/ad/' + value;
					}

					angular.extend(scope, {
						facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
						gplus: 'https://plus.google.com/share?url=' + url,
						twitter: 'https://twitter.com/share?url=' + url,
						linkedin: 'http://www.linkedin.com/shareArticle?mini=true&url=' + url
					});
				});

			}

		};
	}
]);