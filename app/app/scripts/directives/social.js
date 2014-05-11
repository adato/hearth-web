'use strict';

/**
 * @ngdoc directive
 * @name social
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
				id: '='
			},
			templateUrl: 'templates/social.html',
			link: function(scope) {
				var url = window.location.href + '?id=' + scope.id;
				shortener.shorten(url).then(function(shortUrl) {
					angular.extend(scope, {
						facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + shortUrl,
						gplus: 'https://plus.google.com/share?url=' + shortUrl,
						twitter: 'https://twitter.com/share?url=' + shortUrl,
						linkedin: 'http://www.linkedin.com/shareArticle?mini=true&url=' + shortUrl
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