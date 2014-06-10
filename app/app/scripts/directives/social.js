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
			templateUrl: 'templates/social.html',
			link: function(scope) {
				scope.$watch('item', function(item) {
					var url = window.location.href.replace(window.location.hash, '');
					if (item) {
						url += '%23/ad/' + item._id;
					}
					scope.url = url;
					angular.extend(scope, {
						facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
						gplus: 'https://plus.google.com/share?url=' + url,
						twitter: 'https://twitter.com/share?url=' + url,
						linkedin: 'http://www.linkedin.com/shareArticle?mini=true&url=' + url
					});
					scope.click = function() {

						FB.ui({
							method: 'share_open_graph',
							action_properties: JSON.stringify({
								url: url,
								title: item.title,
								description: item.name
							})

						});
					}

				});

			}

		};
	}
]);