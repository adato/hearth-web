'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.social
 * @description Displays social networks links
 * @restrict E
 */
angular.module('hearth.directives').directive('social', [
	'shortener',

	function(shortener) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			scope: {
				item: '='
			},
			templateUrl: 'templates/social.html',
			link: function(scope) {
				scope.$watch('item', function(value) {
					var url = window.location.origin + '/%23/ad/' + value;
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
]).factory('shortener', [
	'$q',
	function($q) {
		return {
			shorten: function(url) {
				var deferred = $q.defer();

				$.ajax({
					dataType: 'json',
					url: 'https://www.googleapis.com/urlshortener/v1/url?key=' + $$config.gApiKey,
					data: JSON.stringify({
						'longUrl': url,
						key: $$config.gApiKey
					}),
					contentType: 'application/json',
					type: 'post',
					'processData': false,
					success: function(response) {
						deferred.resolve(response.id);
					}
				});

				return deferred.promise;
			}
		};
	}
]);